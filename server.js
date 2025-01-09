import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";

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

// Middleware
app.use(cors({
    origin: ["http://localhost:5003", "https://ai-project-neon.vercel.app"],
    credentials: true,
}));
app.use('/', express.static('dist'))
app.use(express.json());
app.use(helmet());

// Подключение к MongoDB
mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));

// Определение модели пользователя
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Список пользователей
const users = [
    { username: "testuser", password: "password123" },
    { username: "oleamba", password: "kim4124" },
];

// Определение схемы комментариев и модели после подключения к базе данных
const commentSchema = new mongoose.Schema({
    text: String,
    author: String,
    createdAt: { type: Date, default: Date.now },
});
const Comment = mongoose.model('Comment', commentSchema);

// Хэширование паролей и добавление пользователей в MongoDB
(async () => {
    const saltRounds = 10;

    try {
        // Создание тестового комментария
        const testComment = new Comment({
            text: "This is a test comment",
            author: "Test Author"
        });

        // Сохраняем пользователей и тестовый комментарий
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

        await testComment.save();
        console.log("Test comment created successfully");
    } catch (error) {
        console.error("Error hashing passwords or saving users:", error);
        console.error("Error creating test comment:", error);
    }
})();

// Маршрут для логина
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
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token
        });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});

// Получение всех пользователей
app.get('/api/alluser', async (req, res) => {
    try {
        const users = await User.find({}, { username: 1, _id: 0 });

        res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

// Получение всех комментариев
app.get('/api/comments', async (req, res) => {
    try {
        const comments = await Comment.find({}, { text: 1, author: 1, createdAt: 1, _id: 0 });

        res.status(200).json({
            success: true,
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

// Создание нового комментария
app.post('/api/comments', async (req, res) => {
    const { text, author } = req.body;

    if (!text || !author) {
        return res.status(400).json({
            success: false,
            message: "Text and author are required"
        });
    }

    try {
        // Создание нового комментария
        const newComment = new Comment({
            text,
            author
        });

        // Сохранение комментария в базе данныхsdsds
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

// Обработчик ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ success: false, message: "Something broke!" });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Server is also accessible on https://ai-project-neon.vercel.app`);
});

export default app;
