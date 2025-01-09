import mongoose from "mongoose";

// Определение схемы для пользователей
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// Создание модели для пользователей
const User = mongoose.model("User", userSchema);

export default User;




