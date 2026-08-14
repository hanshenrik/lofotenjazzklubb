import { format, formatDistanceToNow, formatISO } from "date-fns";
import { nb } from "date-fns/locale";

/**
 * Date formatting for the whole site.
 *
 * Everything here runs on date-fns, but call sites import these wrappers rather
 * than date-fns directly. That keeps the Norwegian locale and the format
 * patterns in one place — so a format can be corrected once instead of hunting
 * down `format(date, "...")` calls scattered across components.
 */
export type DateFormatter = (date: Date) => string;

const pattern =
  (template: string): DateFormatter =>
  (date) =>
    format(date, template, { locale: nb });

/** 14.08.2026 20:00 — the default across the site. */
export const formatDateTime = pattern("dd.MM.yyyy HH:mm");

/** 14.08.2026 */
export const formatDate = pattern("dd.MM.yyyy");

/** 20:00 */
export const formatTime = pattern("HH:mm");

/** 14. august 2026 */
export const formatDateLong = pattern("d. MMMM yyyy");

/** 14. august 2026 kl. 20:00 */
export const formatDateTimeLong = pattern("d. MMMM yyyy 'kl.' HH:mm");

/** fredag 14. august */
export const formatWeekdayDate = pattern("EEEE d. MMMM");

/** fredag 14. august kl. 20:00 — useful for event listings. */
export const formatWeekdayDateTime = pattern("EEEE d. MMMM 'kl.' HH:mm");

/** august 2026 — for grouping headers. */
export const formatMonthYear = pattern("MMMM yyyy");

/**
 * 2026-08-14T20:00:00+02:00 — machine readable, for a <time datetime> attribute.
 * Keeps the local offset rather than normalising to UTC, so the wall-clock time
 * an event starts at survives the round trip.
 */
export const formatIso: DateFormatter = (date) => formatISO(date);

/**
 * "om 3 dager" / "for 2 måneder siden".
 *
 * Relative to *now*, so calling this during the build freezes the phrasing at
 * build time. Render it through <RelativeTime> instead, which recomputes it in
 * the browser and keeps it true for the reader.
 */
export const formatRelativeToNow: DateFormatter = (date) =>
  formatDistanceToNow(date, { locale: nb, addSuffix: true });
