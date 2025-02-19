import { createI18n } from 'vue-i18n';

const i18n = createI18n({
    locale: 'en', // Язык по умолчанию
    fallbackLocale: 'en',
    messages: {}, // Изначально пусто, будем загружать динамически
});

export default i18n;
