// Shared display formatting helpers.

/** Formats a number as a Pakistani Rupee amount, e.g. 1500 -> "Rs 1,500". */
export const formatPrice = (value) => {
    const amount = Number(value);
    if (!Number.isFinite(amount)) return "Rs 0";
    return `Rs ${amount.toLocaleString("en-PK")}`;
};

/** Turns a category slug into a readable label, e.g. "smart-phones" -> "Smart Phones". */
export const formatCategory = (slug) => {
    if (!slug) return "Other";
    return String(slug)
        .replace(/[-_]+/g, " ")
        .trim()
        .replace(/\b\w/g, (character) => character.toUpperCase());
};
