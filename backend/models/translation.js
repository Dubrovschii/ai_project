import mongoose from "mongoose";




const translationItemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        subtitle: {
            type: String,
            required: true,
        },
        linkAi: {
            type: String,
            required: true,
        },
        linkLang: {
            type: String,
            required: true,
        },
        linkList: {
            type: String,
            required: true,
        },
        linkRewiew: {
            type: String,
            required: true,
        },
        linkStatistic: {
            type: String,
            required: true,
        },
        content_nofouded: {
            type: String,
            required: true,
        },
        title_content: {
            type: String,
            required: true,
        },
        title_sidebar: {
            type: String,
            required: true,
        },
    },
    { _id: false } // Убираем автоматическое поле _id для элементов
);

const translationSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true, // Пример: "myaccount"
        },
        translations: {
            en: {
                type: Object, // Для английских переводов (структура может быть вложенной)
                default: {}, // По умолчанию пустой объект
            },
            ru: {
                type: [translationItemSchema], // Массив объектов с переводами для русского языка
                default: [], // По умолчанию пустой массив
            },
        },
    },
    { timestamps: true } // Добавляет createdAt и updatedAt
);


// const translationSchema = new mongoose.Schema({
//     _id: {
//         type: String,
//         required: true,
//     },
//     translations: {
//         en: {
//             type: Object,
//             default: {},
//         },
//         ru: {
//             type: Object,
//             default: {},
//         },
//     },
// }, { timestamps: true });


// const translationSchema = new mongoose.Schema({
//     _id: {
//         type: String,
//         required: true,
//     },
//     translations: {
//         en: {
//             type: [
//                 {
//                     key: { type: String, required: true }, // Ключ перевода
//                     value: { type: mongoose.Schema.Types.Mixed, required: true }, // Значение перевода (может быть строкой или объектом)
//                 },
//             ],
//             default: [],
//         },
//         ru: {
//             type: [
//                 {
//                     key: { type: String, required: true },
//                     value: { type: mongoose.Schema.Types.Mixed, required: true },
//                 },
//             ],
//             default: [],
//         },
//     },
// }, { timestamps: true });
const Translation = mongoose.model("TranslationSchema", translationSchema);

export default Translation;
