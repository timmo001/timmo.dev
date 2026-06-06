import { addMilliseconds, format, getYear, isAfter, parseISO } from "date-fns";
import { type Locale } from "date-fns";
import { enGB } from "date-fns/locale";

export const DATE_TIME_FORMAT = "PPp";

export const fallbackLocale = enGB;

export function getCurrentYear(): number {
  return getYear(new Date());
}

export function formatDateTime(date: Date, locale: Locale = enGB): string {
  return format(date, DATE_TIME_FORMAT, { locale });
}

export function formatDateTimeFallback(date: Date): string {
  return formatDateTime(date, fallbackLocale);
}

export function formatIsoDateTime(iso: string, locale: Locale = enGB): string {
  return formatDateTime(parseISO(iso), locale);
}

export function addCacheExpiry(fetchedAt: number, ttlMs: number): number {
  return addMilliseconds(fetchedAt, ttlMs).getTime();
}

export function isCacheValid(expiresAt: number): boolean {
  return isAfter(expiresAt, Date.now());
}
