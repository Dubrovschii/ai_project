import mongoose from "mongoose";

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
    online: {
        type: Boolean,
        required: false,
        default: false,
    },
    avatar: {
        data: Buffer,
        contentType: String,
    },
    name: {
        type: String,
        required: false,
    },
    surname: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    age: {
        type: Number,
        required: false,
    },
    profession: {
        type: String,
        required: false,
    },
    hobby: {
        type: String,
        required: false,
    },
    phone: {
        type: Number,
        required: false,
    },
});

const User = mongoose.model("User", userSchema);

export default User;
