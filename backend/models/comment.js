import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text: String,
    author: String,
    createdAt: { type: Date, default: Date.now },
});
// Создание модели для пользователей
const Comment = mongoose.model("Comment", commentSchema);

export default Comment;




