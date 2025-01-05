// import express from "express";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import cors from "cors";
// import dotenv from "dotenv"; // Импорт dotenv
// import mongoose from "mongoose";
// import helmet from "helmet";
// dotenv.config(); // Инициализация dotenv для загрузки переменных окружения


// const app = express();
// const DB_URL = process.env.DB_URL;
// const PORT = process.env.PORT || 5003;

// // Middleware для CORS (добавляем один раз, до маршрутов)
// app.use(cors({
//     origin: ["http://localhost:5003", "https://ai-project-neon.vercel.app"], // Локальный и удалённый фронтенды
//     credentials: true,
// }));

// app.use(express.json());
// app.use(helmet());

// const users = [
//     {
//         id: 1,
//         username: "testuser",
//         password: "password123",
//     },
//     {
//         id: 2,
//         username: "oleamba",
//         password: "kim4124",
//     },
// ];

// // Хэшируем пароли всех пользователей при старте сервера
// (async () => {
//     const saltRounds = 10;

//     // Хэшируем пароли для каждого пользователя
//     for (let user of users) {
//         user.password = await bcrypt.hash(user.password, saltRounds);
//     }
// })();

// // Маршрут для входа
// app.post("/api/login", async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         // Находим пользователя в массиве
//         const user = users.find((u) => u.username === username);
//         if (!user) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }

//         // Проверяем пароль с хэшированным значением
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return res.status(401).json({ success: false, message: "Invalid password" });
//         }

//         // Создаем JWT-токен
//         const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
//         return res.json({ success: true, token });
//     } catch (error) {
//         console.error('Error during login:', error);
//         return res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
// });
// mongoose
//   .connect(DB_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((err) => {
//     console.error("Error connecting to MongoDB:", err);
//   });
// // Запуск сервера
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
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
const DB_URL = process.env.DB_URL;

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
app.use(express.json());
app.use(helmet());

// Подключение к MongoDB
mongoose
    .connect(DB_URL)
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

// Хэширование паролей и добавление пользователей в MongoDB
(async () => {
    const saltRounds = 10;

    try {
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

// Маршрут для входа
app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Username and password are required" });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return res.json({ success: true, token });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// Middleware для обработки ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ success: false, message: "Something broke!" });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
