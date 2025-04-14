import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import multer from 'multer';
import { createServer } from "http";
import { Server } from "socket.io";
import Comment from './backend/models/comment.js';
import User from "./backend/models/user.js";
import translationsRouter from './backend/translationsRouter.js';

const app = express();


// Настройка Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5003;

// Проверка наличия JWT_SECRET
if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables.");
    process.exit(1);
}


// Настройка CORS
const corsOptions = {
    origin: ["https://ai-project-neon.vercel.app", "http://localhost:5173", "http://localhost:5003"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use(cors(corsOptions));

// Настройка WebSocket
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            "https://ai-project-neon.vercel.app",
            "http://localhost:5173",
            "http://localhost:5003"
        ],
        methods: ["GET", "POST"],
        credentials: true,
    },
});


async function loadUsersFromDB() {
    const allUsers = await User.find();
    console.log("Загружены пользователи:", allUsers.map(u => u.username));
    return new Set(allUsers.map(u => u.name));
}
loadUsersFromDB();
const users = {};
const allUsers = new Set();
const pendingMessages = {};



// Middleware


io.on("connection", (socket) => {
    console.log("Пользователь подключился");


    socket.on("chat message", (data) => {
        console.log(`Сообщение от ${data.from}: ${data.message}`);
        io.emit("chat message", data);
    });


    socket.on("user connected", async (userName) => {
        users[userName] = socket.id;
        allUsers.add(userName); // Добавляем в общий список пользователей

        try {
            // Обновляем статус пользователя как онлайн в базе данных
            await User.findOneAndUpdate({ username: userName }, { online: true }, { new: true });

            // Отправляем отложенные сообщения
            if (pendingMessages[userName]) {
                pendingMessages[userName].forEach((msg) => {
                    socket.emit("private message", msg);
                });
                delete pendingMessages[userName]; // Очищаем после отправки
            }

            // Обновляем список пользователей с онлайн-статусами
            await updateUserList();
        } catch (err) {
            console.error("Ошибка обновления статуса пользователя:", err);
        }
    });
    socket.on("private message", ({ from, to, message }) => {
        const recipientSocketId = users[to];

        if (recipientSocketId) {
            // Если получатель онлайн – отправляем сразу
            io.to(recipientSocketId).emit("private message", { from, message, to });
        } else {
            // Если оффлайн – сохраняем сообщение
            if (!pendingMessages[to]) {
                pendingMessages[to] = [];
            }
            pendingMessages[to].push({ from, message, to });
        }
    });


    socket.on("disconnect", async () => {
        const disconnectedUser = Object.keys(users).find((key) => users[key] === socket.id);
        if (disconnectedUser) {
            delete users[disconnectedUser];

            try {
                // Обновляем статус пользователя как офлайн в базе данных
                const user = await User.findOneAndUpdate({ username: disconnectedUser }, { online: false }, { new: true });

                console.log(`${disconnectedUser} отключился. Статус в базе: ${user.online}`);
                console.log("Обновленный список пользователей:", Object.keys(users));

                updateUserList();
            } catch (err) {
                console.error("Ошибка обновления статуса пользователя при отключении:", err);
            }
        }
    });

    async function updateUserList() {
        const dbUsers = await User.find();
        const userList = dbUsers.map((user) => ({
            name: user.username,
            online: user.online // Статус пользователя (онлайн/оффлайн)
        }));

        console.log("Обновленный список пользователей:", userList);
        io.emit("users list", userList); // Отправляем всем клиентам обновленный список пользователей
    }
});

app.use('/', express.static('dist'));
app.use(express.json());
app.use(helmet());

mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));

app.use('/translations', translationsRouter);


(async () => {
    const saltRounds = 10;

    try {
        const usersToAdd = [
            { username: "User1", password: "pass123" },
            { username: "User2", password: "pass456" }
        ];

        for (let userData of usersToAdd) {
            // Проверяем, есть ли пользователь в базе
            const existingUser = await User.findOne({ username: userData.username });
            if (existingUser) {
                console.log(`Пользователь ${userData.username} уже существует`);
                continue;
            }

            // Хешируем пароль
            const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

            // Создаём нового пользователя
            await User.create({ username: userData.username, password: hashedPassword });

            console.log(`Пользователь ${userData.username} успешно добавлен`);
        }
    } catch (error) {
        console.error("Ошибка при добавлении пользователей:", error);
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





server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
export default app;













