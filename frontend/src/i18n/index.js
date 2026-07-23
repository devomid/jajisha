import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "../locales/en/common.json";
import fa from "../locales/fa/common.json";

const initI18n = async () => {

    const savedLanguage =
        await AsyncStorage.getItem("language");

    await i18n
        .use(initReactI18next)
        .init({

            compatibilityJSON: "v4",

            resources: {

                en: {
                    translation: en,
                },

                fa: {
                    translation: fa,
                },

            },

            lng: savedLanguage || "en",

            fallbackLng: "en",

            interpolation: {
                escapeValue: false,
            },

        });

};

export { initI18n };

export default i18n;