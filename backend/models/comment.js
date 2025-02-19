// // import mongoose from "mongoose";

// // const commentSchema = new mongoose.Schema({
// //     text: String,
// //     author: String | Number,
// //     createdAt: { type: Date, default: Date.now },
// // });
// // // Создание модели для пользователей
// // const Comment = mongoose.model("Comment", commentSchema);

// // export default Comment;




// import mongoose from "mongoose";

// const commentSchema = new mongoose.Schema({
//     author: {
//         type: mongoose.Schema.Types.Mixed, // Используем Mixed для поддержки различных типов данных
//         required: true
//     },
//     text: String,
//     rating: Number,
//     createdAt: { type: Date, default: Date.now },
// });

// // Создание модели для комментариев
// const Comment = mongoose.model("Comment", commentSchema);

// export default Comment;
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.Mixed, // Используем Mixed для поддержки различных типов данных
        required: true
    },
    text: String,
    rating: Number,
    createdAt: { type: Date, default: Date.now },
});

// Добавляем виртуальное поле 'id', которое будет равно '_id'
commentSchema.virtual('id').get(function () {
    return this._id.toString();
});

// Создание модели для комментариев
const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
