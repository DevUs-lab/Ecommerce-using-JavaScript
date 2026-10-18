import { useEffect } from "react";

// Canonical site URL used for canonical tags, Open Graph URLs and JSON-LD.
export const SITE_URL = "https://needbuy.vercel.app";

const DEFAULT_TITLE = "Need Buy – Online Shopping Store in Pakistan";
const DEFAULT_DESCRIPTION =
    "Need Buy is Pakistan's leading online shopping store offering quality products, affordable prices, and fast delivery nationwide. Shop now for the best deals!";
const DEFAULT_IMAGE = `${SITE_URL}/hero.webp`;

const upsertMeta = (attribute, key, content) => {
    if (!content) return;
    let tag = document.head.querySelector(`meta[${attribute}="${key}"]`);
    if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attribute, key);
        document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
};

const upsertCanonical = (href) => {
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
    }
    link.setAttribute("href", href);
};

const upsertJsonLd = (jsonLd) => {
    const existing = document.getElementById("page-jsonld");
    if (existing) existing.remove();
    if (!jsonLd) return;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "page-jsonld";
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
};

/**
 * Updates the document head for the current page: title, meta description,
 * canonical, robots, Open Graph, Twitter card and structured data (JSON-LD).
 *
 * Renders nothing. Put it at the top of any page component.
 *
 * Usage:
 *   <Seo title="Products" description="..." path="/products" />
 *   <Seo title="Cart" path="/cart" robots="noindex, nofollow" />
 */
const Seo = ({
    title,
    description,
    path = "/",
    robots = "index, follow",
    image,
    type = "website",
    jsonLd,
}) => {
    const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : "";

    useEffect(() => {
        const fullTitle =
            !title || title.includes("Need Buy")
                ? title || DEFAULT_TITLE
                : `${title} | Need Buy Store`;
        const metaDescription = description || DEFAULT_DESCRIPTION;
        const metaImage = image || DEFAULT_IMAGE;
        const url = `${SITE_URL}${path}`;

        document.title = fullTitle;

        upsertMeta("name", "description", metaDescription);
        upsertMeta("name", "robots", robots);

        upsertMeta("property", "og:title", fullTitle);
        upsertMeta("property", "og:description", metaDescription);
        upsertMeta("property", "og:url", url);
        upsertMeta("property", "og:type", type);
        upsertMeta("property", "og:image", metaImage);

        upsertMeta("name", "twitter:title", fullTitle);
        upsertMeta("name", "twitter:description", metaDescription);
        upsertMeta("name", "twitter:url", url);
        upsertMeta("name", "twitter:image", metaImage);

        upsertCanonical(url);
        upsertJsonLd(jsonLdKey ? JSON.parse(jsonLdKey) : null);
    }, [title, description, path, robots, image, type, jsonLdKey]);

    return null;
};

export default Seo;
