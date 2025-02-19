import express from "express";
import Translation from "../backend/models/translation.js";

const translationsRouter = express.Router();

translationsRouter.get("/:language", async (req, res) => {
    const { language } = req.params;

    try {
        if (!["en", "ru"].includes(language)) {
            return res.status(400).json({
                success: false,
                message: `Invalid language '${language}'`,
            });
        }

        const translationDoc = await Translation.findById("myaccount");

        if (!translationDoc) {
            return res.status(404).json({
                success: false,
                message: "Translations not found",
            });
        }

        const translations = translationDoc.translations[language];

        if (!translations || (Array.isArray(translations) && translations.length === 0)) {
            return res.status(404).json({
                success: false,
                message: `Translations for language '${language}' not found`,
            });
        }

        res.status(200).json({
            success: true,
            translations,
            message: `Translations for language '${language}' successfully retrieved`,
        });
    } catch (error) {
        console.error("Error fetching translations:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching translations",
        });
    }
});

export default translationsRouter;

