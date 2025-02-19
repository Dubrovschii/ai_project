import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import multer from 'multer';

import Comment from './backend/models/comment.js';
import User from "./backend/models/user.js";  // Исправленный импорт
import translationsRouter from './backend/translationsRouter.js';

// Настройка Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Загрузка переменных окружения
dotenv.config();

// Строка подключения к MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5003;

// Проверка наличия JWT_SECRET
if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables.");
    process.exit(1);
}

// Создание приложения Express
const app = express();

// Настройка CORS
const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5003", "https://ai-project-neon.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use(cors(corsOptions));

// Middleware
app.use('/', express.static('dist'));
app.use(express.json());
app.use(helmet());

// Подключение к MongoDB
mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));

// Подключение роутов
app.use('/translations', translationsRouter);

// Хэширование паролей и добавление пользователей в базу данных
(async () => {
    const saltRounds = 10;

    try {
        const users = await User.find(); // Получаем всех пользователей из базы данных

        for (let user of users) {
            const existingUser = await User.findOne({ username: user.username });
            if (existingUser) {
                console.log(`User ${user.username} already exists`);
                continue;
            }
            const hashedPassword = await bcrypt.hash(user.password, saltRounds);
            const newUser = new User({ username: user.username, password: hashedPassword });
            await newUser.save();
            console.log(`User ${user.username} saved to database`);
        }
    } catch (error) {
        console.error("Error hashing passwords or saving users:", error);
    }
})();


app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Username and password are required"
        });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(200).json({
                success: false,
                message: "User not found"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(200).json({
                success: false,
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            { user_name: user.username, user_id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            success: true,
            user_name: user.username,
            user_id: user._id,
            message: "Login successful",
            token
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});

app.get('/api/comments', async (req, res) => {
    const { page = 1, limit = 6 } = req.query;
    try {
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);

        const comments = await Comment.find({}, { text: 1, author: 1, rating: 1, createdAt: 1, _id: 1 })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum);

        const totalComments = await Comment.countDocuments();

        res.status(200).json({
            success: true,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(totalComments / limitNum),
            totalComments,
            comments,
        });
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

app.post('/api/comments', async (req, res) => {
    const { text, author, rating } = req.body;

    if (!text || !author || !rating) {
        return res.status(400).json({
            success: false,
            message: "Text and author are required"
        });
    }

    try {
        const newComment = new Comment({ text, author, rating });
        await newComment.save();

        res.status(201).json({
            success: true,
            message: "Comment created successfully",
            comment: newComment
        });
    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

app.delete('/api/comments/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedComment = await Comment.findByIdAndDelete(id);
        if (!deletedComment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

app.post('/api/upload/:username', upload.single('file'), async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.avatar = {
            data: req.file.buffer,
            contentType: req.file.mimetype,
        };

        await user.save();

        res.status(200).json({ success: true, message: 'Avatar uploaded successfully' });
    } catch (error) {
        console.error('Error uploading avatar:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.get('/api/avatar/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });

        if (!user || !user.avatar) {
            return res.status(404).json({ success: false, message: 'Avatar not found' });
        }

        res.set('Content-Type', user.avatar.contentType);
        res.send(user.avatar.data);
    } catch (error) {
        console.error('Error retrieving avatar:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.delete('/api/avatar/:username', async (req, res) => {
    try {
        const { username } = req.params;

        // Находим пользователя по username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Если аватар существует, удаляем его
        if (user.avatar) {
            user.avatar = undefined;  // Удаляем поле аватара
            await user.save(); // Сохраняем изменения в базе данных
        } else {
            return res.status(404).json({ success: false, message: 'Avatar not found' });
        }

        res.status(200).json({ success: true, message: 'Avatar deleted successfully' });
    } catch (error) {
        console.error('Error deleting avatar:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.post('/api/post-info/:username', upload.single('input'), async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (req.body.name) user.name = req.body.name;
        if (req.body.surname) user.surname = req.body.surname;
        if (req.body.email) user.email = req.body.email;
        if (req.body.age) user.age = req.body.age;
        if (req.body.profession) user.profession = req.body.profession;
        if (req.body.hobby) user.hobby = req.body.hobby;
        if (req.body.phone) user.phone = req.body.phone;

        // Обработка файла аватара, если он был отправлен
        if (req.file) {
            user.avatar = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };
        }

        await user.save();

        res.status(200).json({ success: true, message: 'User information updated successfully' });
    } catch (error) {
        console.error('Error updating user info:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
app.get('/api/post-info/:username', async (req, res) => {
    try {
        const { username } = req.params;

        // Находим пользователя по имени пользователя
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({
            success: true,
            data: {
                name: user.name,
                surname: user.surname,
                email: user.email,
                age: user.age,
                profession: user.profession,
                hobby: user.hobby,
                phone: user.phone,
                avatar: user.avatar, // если нужно
            },
        });
    } catch (error) {
        console.error('Error retrieving user info:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
app.put('/api/post-info/:username', async (req, res) => {
    try {
        const { username } = req.params;

        // Находим пользователя по имени пользователя
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({
            success: true,
            data: {
                name: user.name,
                surname: user.surname,
                email: user.email,
                age: user.age,
                profession: user.profession,
                hobby: user.hobby,
                phone: user.phone,
                avatar: user.avatar, // если нужно
            },
        });
    } catch (error) {
        console.error('Error retrieving user info:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ success: false, message: "Something broke!" });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
