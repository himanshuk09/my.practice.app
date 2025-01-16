import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import { TranslationKeys } from "@/languageKeys/languagekey";

const englishIN = "en-IN";
const germany = "de-DE";
const englishUS = "en-US";

const i18n: any = new I18n(TranslationKeys);

const deviceLocale = Localization.getLocales()[0]?.languageCode || englishUS;
i18n.locale = deviceLocale;

i18n.enableFallback = true;

export { i18n, englishIN, germany, englishUS };
