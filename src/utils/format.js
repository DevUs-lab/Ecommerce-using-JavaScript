// Shared display formatting helpers.

/** Formats a number as a Pakistani Rupee amount, e.g. 1500 -> "Rs 1,500". */
export const formatPrice = (value) => {
    const amount = Number(value);
    if (!Number.isFinite(amount)) return "Rs 0";
    return `Rs ${amount.toLocaleString("en-PK")}`;
};

/** Converts a Firestore Timestamp, Date or number into a Date (or null). */
export const toDate = (value) => {
    if (!value) return null;
    if (typeof value.toDate === "function") return value.toDate();
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
};

/** Formats a timestamp as e.g. "18 Oct 2026, 4:20 PM". */
export const formatDateTime = (value, fallback = "—") => {
    const date = toDate(value);
    if (!date) return fallback;
    return date.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
};

/** Shortens a long document id for display, e.g. "AbCdEf12Gh…" -> "AbCdEf12…". */
export const shortId = (id) => {
    if (!id) return "—";
    return id.length > 10 ? `${id.slice(0, 8)}…` : id;
};

/** Turns a category slug into a readable label, e.g. "smart-phones" -> "Smart Phones". */
export const formatCategory = (slug) => {
    if (!slug) return "Other";
    return String(slug)
        .replace(/[-_]+/g, " ")
        .trim()
        .replace(/\b\w/g, (character) => character.toUpperCase());
};
