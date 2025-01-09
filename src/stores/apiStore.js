import { defineStore } from "pinia";
import axios from "axios";
import { useNotification } from "@kyvg/vue3-notification";
import { ref } from "vue";
import router from "@/router/index";

const { notify } = useNotification();

export const useApiStore = defineStore("apiStore", {
    state: () => ({
        baseLink: ref("https://ai-project-neon.vercel.app")
        // dialog: ref(false),
        // dialogBuy: ref(false),
        // dialogCheckCard: ref(false),
    }),
    actions: {
    }
});
