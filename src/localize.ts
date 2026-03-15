import { HomeAssistant } from "./ha-types";
import en from "./translations/en";
import es from "./translations/es";

const translations = {
  en,
  es,
} as const;

type TranslationLanguage = keyof typeof translations;

function getPathValue(source: unknown, path: string): string | undefined {
  return path
    .split(".")
    .reduce<unknown>(
      (value, segment) =>
        value && typeof value === "object"
          ? (value as Record<string, unknown>)[segment]
          : undefined,
      source,
    ) as string | undefined;
}

export function resolveLanguage(
  hass?: HomeAssistant,
  configLanguage: "auto" | "es" | "en" = "auto",
): TranslationLanguage {
  if (configLanguage !== "auto") {
    return configLanguage;
  }
  const language = hass?.language?.toLowerCase().split("-")[0];
  if (language === "en") {
    return "en";
  }
  return "es";
}

export function localize(
  key: string,
  hass?: HomeAssistant,
  configLanguage: "auto" | "es" | "en" = "auto",
): string {
  const lang = resolveLanguage(hass, configLanguage);
  return (
    getPathValue(translations[lang], key) ??
    getPathValue(translations.es, key) ??
    getPathValue(translations.en, key) ??
    key
  );
}
