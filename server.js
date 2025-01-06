
// import express from "express";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import cors from "cors";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import helmet from "helmet";

// // Загрузка переменных окружения
// dotenv.config();

// // Строка подключения к MongoDB
// const DB_URL = process.env.DB_URL;

// const PORT = process.env.PORT || 5003;

// // Проверка наличия JWT_SECRET
// if (!process.env.JWT_SECRET) {
//     console.error("JWT_SECRET is not defined in environment variables.");
//     process.exit(1);
// }

// // Создание приложения Express
// const app = express();

// // Middleware
// // app.use(cors({
// //     origin: ["http://localhost:5003", "https://ai-project-neon.vercel.app"],
// //     credentials: true,
// // }));
// app.use(cors({
//     origin: ["http://localhost:5003", "https://ai-project-neon.vercel.app"],
//     credentials: true,
// }));

// app.use(express.json());
// app.use(helmet());

// // Подключение к MongoDB
// mongoose
//     .connect(DB_URL)
//     .then(() => console.log("Connected to MongoDB"))
//     .catch((err) => console.error("Error connecting to MongoDB:", err));

// // Определение модели пользователя
// const userSchema = new mongoose.Schema({
//     username: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
// });

// const User = mongoose.model("User", userSchema);

// // Список пользователей
// const users = [
//     { username: "testuser", password: "password123" },
//     { username: "oleamba", password: "kim4124" },
// ];

// // Хэширование паролей и добавление пользователей в MongoDB
// (async () => {
//     const saltRounds = 10;

//     try {
//         for (let user of users) {
//             const existingUser = await User.findOne({ username: user.username });
//             if (existingUser) {
//                 console.log(`User ${user.username} already exists`);
//                 continue;
//             }
//             const hashedPassword = await bcrypt.hash(user.password, saltRounds);
//             const newUser = new User({ username: user.username, password: hashedPassword });
//             await newUser.save();
//             console.log(`User ${user.username} saved to database`);
//         }
//     } catch (error) {
//         console.error("Error hashing passwords or saving users:", error);
//     }
// })();


// app.post("/api/login", async (req, res) => {
//     // Получаем username и password из тела запроса
//     const { username, password } = req.body;

//     // Логируем полученные данные (удалите в продакшн-версии)
//     // console.log("Login attempt:", { username, password: password ? "***" : null });

//     // Проверяем, что оба значения указаны
//     if (!username || !password) {
//         return res.status(400).json({
//             success: false,
//             message: "Username and password are required"
//         });
//     }

//     try {
//         // Ищем пользователя в базе данных
//         const user = await User.findOne({ username });
//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }

//         // Проверяем пароль
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid password"
//             });
//         }

//         // Генерируем JWT токен
//         const token = jwt.sign(
//             { id: user._id },
//             process.env.JWT_SECRET,
//             { expiresIn: "1h" }
//         );

//         // Возвращаем успешный ответ с токеном
//         return res.status(200).json({
//             success: true,
//             message: "Login successful",
//             token
//         });
//     } catch (error) {
//         // Логируем ошибку и возвращаем ответ с кодом 500
//         console.error("Error during login:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal Server Error"
//         });
//     }
// });


// // Middleware для обработки ошибок
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send({ success: false, message: "Something broke!" });
// });

// // Запуск сервера
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
//     // console.log(`Server is running on ai-project-neon.vercel.app/`);
// });
// export default app;




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

app.post("/api/login", async (req, res) => {
    // Получаем username и password из тела запроса
    const { username, password } = req.body;

    // Логируем полученные данные (удалите в продакшн-версии)
    // console.log("Login attempt:", { username, password: password ? "***" : null });

    // Проверяем, что оба значения указаны
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Username and password are required"
        });
    }

    try {
        // Ищем пользователя в базе данных
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Проверяем пароль
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        // Генерируем JWT токен
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Возвращаем успешный ответ с токеном
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token
        });
    } catch (error) {
        // Логируем ошибку и возвращаем ответ с кодом 500
        console.error("Error during login:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});

app.get('/api/alluser', async (req, res) => {
    try {
        // Получаем всех пользователей из базы данных
        const users = await User.find({}, { username: 1, _id: 0 }); // Возвращаем только username, без _id

        // Отправляем успешный ответ с массивом пользователей
        res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        // Логируем ошибку и отправляем ответ с кодом 500
        console.error("Error fetching users:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
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
    // console.log(`Server is running on ai-project-neon.vercel.app/`);
});
export default app;