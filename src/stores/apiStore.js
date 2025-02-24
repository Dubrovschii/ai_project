
import { defineStore } from "pinia";
import axios from "axios";
import { useNotification } from "@kyvg/vue3-notification";
import { ref } from "vue";

const { notify } = useNotification();

export const useApiStore = defineStore("apiStore", {
    state: () => ({
        baseLink: "http://localhost:5173/",
        authorName: "",
        message: "",
        currentLang: localStorage.getItem("currentLang") || "en",
        enLang: true,
        ruLang: false,
        translations: {},
        contentRouteSideMenu: {},
        contentMyaccount: {},
        contentHomePage: {
            home_title: '',
            home_descr: '',
            home_review: []
        },
        contentReviewPage: {
            review_title: '',
            review_descr: '',
            review_form_title: '',
            review_form_descr: '',
        },
        contentGlobal: {
            save: ''
        },
        avatarSrc: '',
        usernameName: '',
        usernameSurname: '',
        usernameEmail: '',
        usernameAge: '',
        usernameProfession: '',
        usernameHobby: '',
        usernamePhone: '',
    }),

    actions: {
        async loadTranslations(lang) {
            try {
                const response = await axios.get(`/translations/${lang}`);

                if (response.data.success && response.data.translations) {
                    const translations = response.data.translations;

                    if (translations[1]) {
                        this.contentRouteSideMenu.value = {
                            home_route: translations[1].home_route,
                            about_route: translations[1].about_route,
                            review_route: translations[1].review_route,
                        };
                    }
                    if (translations[2]) {
                        this.contentHomePage.value = {
                            home_title: translations[2].home_title,
                            home_descr: translations[2].home_descr,
                            home_review: translations[2].home_review,
                        };

                    }
                    if (translations[3]) {
                        this.contentReviewPage.value = {
                            review_title: translations[3].review_title,
                            review_descr: translations[3].review_descr,
                            review_descr: translations[3].review_descr,
                            review_form_title: translations[3].review_form_title,
                            review_form_descr: translations[3].review_form_descr,
                            review_form_btn: translations[3].review_form_btn,
                            review_form_account_label: translations[3].review_form_account_label,
                            review_form_textarea_label: translations[3].review_form_textarea_label,
                        };

                    }
                    if (translations[4]) {
                        this.contentGlobal.value = {
                            save: translations[4].save,

                        };

                    }

                    if (translations[0]) {
                        this.contentMyaccount.value = {
                            titlePage: translations[0].title,
                            linkList: translations[0].linkList,
                            linkStatistic: translations[0].linkStatistic,
                            linkAi: translations[0].linkAi,
                            linkChat: translations[0].linkChat,
                            linkRewiew: translations[0].linkRewiew,
                            linkLang: translations[0].linkLang,
                            linkExit: translations[0].linkExit,
                            title_sidebar: translations[0].title_sidebar,
                            title_content: translations[0].title_content,
                            content_nofouded: translations[0].content_nofouded,
                        };
                    }

                    this.currentLang = lang;
                } else {
                    notify({
                        type: "error",
                        title: "Error",
                        text: `Failed to load translations for ${lang}.`,
                    });
                    console.error("Failed to load translations:", response.data.message || "Unknown error");
                }
            } catch (error) {
                notify({
                    type: "error",
                    title: "Error",
                    text: "An error occurred while fetching translations.",
                });
                console.error("Error fetching translations:", error);
            }
        },
        getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(";").shift();
            return null;
        },
        setCookie(name, value, days) {
            const expires = new Date();
            expires.setHours(24, 0, 0, 0);
            expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
            document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;Secure;SameSite=Strict`;
        },
        deleteCookie(name) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;Secure;SameSite=Strict`;
        },
        async logout() {
            try {
                this.deleteCookie("user_token");
                this.deleteCookie("user_name");
                this.deleteCookie("user_id");
                notify({
                    title: "Logged out",
                    message: "You have been logged out successfully.",
                    type: "info",
                });
                window.location.href = this.baseLink;
            } catch (error) {
                console.error("Logout error:", error);
                notify({
                    title: "Error",
                    message: "An error occurred while logging out. Please try again.",
                    type: "error",
                });
            }
        },
        async getAvatarUsers() {
            try {
                const username = this.getCookie("user_name");
                const response = await axios.get(`/api/avatar/${username}`, {
                    responseType: "blob",
                });
                if (response && response.data && response.data.size !== 0) {
                    const imageUrlFromServer = URL.createObjectURL(response.data);
                    this.avatarSrc = imageUrlFromServer;
                }
            } catch (error) {
                console.error("Error retrieving avatar:", error);
            }
        }
    },
});
