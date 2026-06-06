import { format } from "date-fns";
import { type Locale } from "date-fns";
import { enGB, enUS } from "date-fns/locale";

const localeLoaders: Record<string, () => Promise<Locale>> = {
  enGB: async () => enGB,
  enUS: async () => enUS,
  de: async () => (await import("date-fns/locale/de")).de,
  fr: async () => (await import("date-fns/locale/fr")).fr,
  es: async () => (await import("date-fns/locale/es")).es,
  it: async () => (await import("date-fns/locale/it")).it,
  ja: async () => (await import("date-fns/locale/ja")).ja,
  nl: async () => (await import("date-fns/locale/nl")).nl,
  pl: async () => (await import("date-fns/locale/pl")).pl,
  pt: async () => (await import("date-fns/locale/pt")).pt,
  sv: async () => (await import("date-fns/locale/sv")).sv,
};

function getLocaleKey(): string {
  const [language, region] = navigator.language.split("-");

  if (region) {
    const regionalKey = `${language}${region.toUpperCase()}`;
    if (regionalKey in localeLoaders) {
      return regionalKey;
    }
  }

  if (language in localeLoaders) {
    return language;
  }

  return "enGB";
}

async function getDateFnsLocale(): Promise<Locale> {
  const localeKey = getLocaleKey();
  return localeLoaders[localeKey]?.() ?? enGB;
}

export async function formatCacheTimes(): Promise<void> {
  const locale = await getDateFnsLocale();

  document.querySelectorAll<HTMLTimeElement>("time[data-local-time]").forEach((element) => {
    const iso = element.getAttribute("datetime");
    if (!iso) return;

    element.textContent = format(new Date(iso), "PPp", { locale });
  });
}
