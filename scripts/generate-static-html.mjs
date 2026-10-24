// Lightweight build-time prerendering.
//
// Runs after `vite build` and writes one static HTML file per public route,
// with the page's <title>, description, canonical, robots, Open Graph /
// Twitter tags and JSON-LD already baked into the markup. Search engines and
// social previews can read all of that without executing JavaScript.
//
// Product pages are generated from the live Firestore catalogue (public
// read) and the sitemap is rebuilt to include them. If the catalogue cannot
// be reached the build still succeeds with the static routes only.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const SITE_URL = "https://needbuy.vercel.app";
const DIST = path.resolve("dist");
const DEFAULT_IMAGE = `${SITE_URL}/hero.webp`;
const DEFAULT_TITLE = "Need Buy - Online Shopping Store in Pakistan";
const DEFAULT_DESCRIPTION =
    "Need Buy is Pakistan's leading online shopping store offering quality products, affordable prices, and fast delivery nationwide. Shop now for the best deals!";
const STORE_DESCRIPTION =
    "Need Buy is Pakistan's leading online shopping store offering quality tech gadgets, affordable prices, and fast delivery nationwide. Shop smartwatches, earbuds, headphones and accessories online.";

const storeJsonLd = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: "Need Buy Store",
    url: SITE_URL,
    logo: `${SITE_URL}/apple-touch-icon.webp`,
    image: `${SITE_URL}/hero.webp`,
    description: STORE_DESCRIPTION,
    email: "umairdevus@gmail.com",
    telephone: "+923190609041",
    currenciesAccepted: "PKR",
    paymentAccepted: "Cash on Delivery, EasyPaisa, JazzCash, Bank Transfer",
    priceRange: "Rs",
    address: { "@type": "PostalAddress", addressCountry: "PK" },
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "What products do you sell?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "At Need Buy Store, we specialize in the best tech gadgets, including smartphones, accessories, smartwatches, and audio devices. We ensure high quality and genuine products for all our customers.",
            },
        },
        {
            "@type": "Question",
            name: "How can I track my order?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Once your order is shipped, we will send you a tracking number via email or SMS. You can use this number to track your package on our delivery partner's website.",
            },
        },
        {
            "@type": "Question",
            name: "What is your return policy?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "We offer a 7-day return policy for defective or damaged items. Please ensure the product is in its original packaging with all accessories included. Contact our support team to initiate a return.",
            },
        },
        {
            "@type": "Question",
            name: "Do you offer cash on delivery (COD)?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, we offer Cash on Delivery (COD) services for most locations. You can pay for your order when it arrives at your doorstep.",
            },
        },
        {
            "@type": "Question",
            name: "How long does delivery take?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Standard delivery typically takes 2-5 working days depending on your location. We strive to process and ship orders as quickly as possible.",
            },
        },
    ],
};

// Mirrors the per-page <Seo> props used by the React pages.
const STATIC_ROUTES = [
    {
        path: "/",
        title: DEFAULT_TITLE,
        description: STORE_DESCRIPTION,
        jsonLd: storeJsonLd,
        changefreq: "daily",
        priority: "1.0",
    },
    {
        path: "/products",
        title: "Products - Shop Tech Gadgets & Accessories Online",
        description:
            "Browse all products at Need Buy Store: smartwatches, earbuds, headphones, mobile accessories and more at the best prices in Pakistan with fast nationwide delivery.",
        changefreq: "daily",
        priority: "0.9",
    },
    {
        path: "/about",
        title: "About Us",
        description:
            "Learn about Need Buy Store - Pakistan's trusted online shop for quality tech gadgets, genuine products, fair prices and fast nationwide delivery.",
        changefreq: "monthly",
        priority: "0.8",
    },
    {
        path: "/contact",
        title: "Contact Us",
        description:
            "Questions about an order, delivery, returns or a product? Contact Need Buy Store by email or WhatsApp - we reply quickly.",
        changefreq: "monthly",
        priority: "0.8",
    },
    {
        path: "/faq",
        title: "FAQs",
        description:
            "Frequently asked questions about Need Buy Store: products, order tracking, return policy, cash on delivery and delivery times in Pakistan.",
        jsonLd: faqJsonLd,
        changefreq: "monthly",
        priority: "0.7",
    },
    {
        path: "/privacy",
        title: "Privacy Policy",
        description:
            "Read how Need Buy Store collects, uses and protects your personal information when you shop on our website.",
        changefreq: "yearly",
        priority: "0.5",
    },
    {
        path: "/terms",
        title: "Terms & Conditions",
        description:
            "The terms and conditions for using Need Buy Store: products and pricing, orders and payments, shipping, returns and refunds.",
        changefreq: "yearly",
        priority: "0.5",
    },
    {
        path: "/cart",
        title: "Your Cart",
        robots: "noindex, nofollow",
    },
    {
        path: "/admin-login",
        title: "Admin Login",
        robots: "noindex, nofollow",
    },
];

const fullTitle = (title) =>
    !title || title.includes("Need Buy") ? title || DEFAULT_TITLE : `${title} | Need Buy Store`;

const esc = (value) =>
    String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

const jsonLdTag = (data) =>
    `<script type="application/ld+json" id="page-jsonld">${JSON.stringify(data).replace(
        /</g,
        "\\u003c"
    )}</script>`;

const setMeta = (html, selector, content) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const tag = `<meta ${selector} content="${esc(content)}" />`;
    const existing = new RegExp(`<meta ${escaped}[^>]*>`);
    return existing.test(html)
        ? html.replace(existing, tag)
        : html.replace("</head>", `${tag}\n</head>`);
};

const buildHtml = (shell, route) => {
    const title = fullTitle(route.title);
    const description = route.description || DEFAULT_DESCRIPTION;
    const url = `${SITE_URL}${route.path}`;
    const image = route.image || DEFAULT_IMAGE;
    const robots = route.robots || "index, follow";

    let html = shell;
    html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
    html = setMeta(html, 'name="title"', title);
    html = setMeta(html, 'name="description"', description);
    html = setMeta(html, 'name="robots"', robots);
    html = setMeta(html, 'property="og:title"', title);
    html = setMeta(html, 'property="og:description"', description);
    html = setMeta(html, 'property="og:url"', url);
    html = setMeta(html, 'property="og:type"', route.type || "website");
    html = setMeta(html, 'property="og:image"', image);
    html = setMeta(html, 'name="twitter:url"', url);
    html = setMeta(html, 'name="twitter:title"', title);
    html = setMeta(html, 'name="twitter:description"', description);
    html = setMeta(html, 'name="twitter:image"', image);
    html = html.replace(
        /<link rel="canonical"[^>]*>/,
        `<link rel="canonical" href="${esc(url)}" />`
    );
    if (route.jsonLd) {
        html = html.replace("</head>", `${jsonLdTag(route.jsonLd)}\n</head>`);
    }
    return html;
};

// Same Cloudinary delivery transform as src/utils/imageOptimization.js.
const optimizedImageUrl = (url, width = 800) => {
    if (typeof url !== "string" || !url.includes("res.cloudinary.com")) return url;
    const segment = "/image/upload/";
    if (!url.includes(segment)) return url;
    const afterUpload = url.split(segment)[1] || "";
    if (afterUpload.includes("f_auto") || afterUpload.includes("q_auto")) return url;
    return url.replace(segment, `${segment}f_auto,q_auto:good,w_${width},c_limit/`);
};

const unwrap = (value) => {
    if (!value || typeof value !== "object") return null;
    if ("stringValue" in value) return value.stringValue;
    if ("integerValue" in value) return Number(value.integerValue);
    if ("doubleValue" in value) return value.doubleValue;
    if ("booleanValue" in value) return value.booleanValue;
    if ("timestampValue" in value) return value.timestampValue;
    if ("nullValue" in value) return null;
    if ("arrayValue" in value) return (value.arrayValue.values || []).map(unwrap);
    if ("mapValue" in value) {
        return Object.fromEntries(
            Object.entries(value.mapValue.fields || {}).map(([key, val]) => [key, unwrap(val)])
        );
    }
    return null;
};

const loadEnv = async () => {
    const env = { ...process.env };
    try {
        const raw = await readFile(path.resolve(".env"), "utf8");
        for (const line of raw.split(/\r?\n/)) {
            const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/);
            if (match && !env[match[1]]) {
                env[match[1]] = match[2].replace(/^["']|["']$/g, "");
            }
        }
    } catch {
        // No .env file — rely on the real environment (e.g. Vercel).
    }
    return env;
};

const fetchProducts = async (env) => {
    const projectId = env.VITE_FIREBASE_PROJECT_ID;
    const apiKey = env.VITE_FIREBASE_API_KEY;
    if (!projectId || !apiKey) {
        throw new Error("VITE_FIREBASE_PROJECT_ID / VITE_FIREBASE_API_KEY not set");
    }

    const products = [];
    let pageToken = "";
    do {
        const url =
            `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/products` +
            `?pageSize=300&key=${apiKey}` +
            (pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : "");
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Firestore REST returned HTTP ${response.status}`);
        }
        const data = await response.json();
        for (const doc of data.documents || []) {
            const fields = Object.fromEntries(
                Object.entries(doc.fields || {}).map(([key, value]) => [key, unwrap(value)])
            );
            products.push({
                id: doc.name.split("/").pop(),
                ...fields,
                updatedAt: doc.updateTime,
            });
        }
        pageToken = data.nextPageToken || "";
    } while (pageToken);

    return products;
};

const productRoute = (product) => {
    const images = (Array.isArray(product.itemImages) ? product.itemImages : [])
        .map((item) => item?.url)
        .filter(Boolean);
    if (images.length === 0 && product.imageUrl) images.push(product.imageUrl);

    const sellPrice = Number(product.sellPrice) || 0;
    const stock = Number(product.stock) || 0;
    const description =
        product.descriptions ||
        `Buy ${product.productName} online at Need Buy Store with fast delivery across Pakistan.`;

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: "Products",
                        item: `${SITE_URL}/products`,
                    },
                    {
                        "@type": "ListItem",
                        position: 3,
                        name: product.productName,
                        item: `${SITE_URL}/product/${product.id}`,
                    },
                ],
            },
            {
                "@type": "Product",
                name: product.productName,
                description,
                image: images.map((img) => optimizedImageUrl(img, 1200)),
                sku: product.id,
                brand: { "@type": "Brand", name: "Need Buy" },
                offers: {
                    "@type": "Offer",
                    url: `${SITE_URL}/product/${product.id}`,
                    priceCurrency: "PKR",
                    price: sellPrice,
                    availability:
                        stock > 0
                            ? "https://schema.org/InStock"
                            : "https://schema.org/OutOfStock",
                    itemCondition: "https://schema.org/NewCondition",
                },
            },
        ],
    };

    return {
        path: `/product/${product.id}`,
        outFile: path.join("product", product.id, "index.html"),
        title: product.productName,
        description,
        image: images[0] ? optimizedImageUrl(images[0], 1200) : DEFAULT_IMAGE,
        type: "product",
        jsonLd,
    };
};

const sitemapEntry = ({ loc, lastmod, changefreq, priority }) =>
    [
        "  <url>",
        `    <loc>${esc(loc)}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        changefreq ? `    <changefreq>${changefreq}</changefreq>` : null,
        priority ? `    <priority>${priority}</priority>` : null,
        "  </url>",
    ]
        .filter(Boolean)
        .join("\n");

async function main() {
    const shell = await readFile(path.join(DIST, "index.html"), "utf8");
    const env = await loadEnv();
    const today = new Date().toISOString().slice(0, 10);

    // 1. Static routes
    for (const route of STATIC_ROUTES) {
        const html = buildHtml(shell, route);
        const outFile =
            route.path === "/"
                ? path.join(DIST, "index.html")
                : path.join(DIST, route.path.slice(1), "index.html");
        await mkdir(path.dirname(outFile), { recursive: true });
        await writeFile(outFile, html);
        console.log(`  static  ${route.path}`);
    }

    // 2. Product pages (best effort — never fail the build over the catalogue)
    let products = [];
    try {
        products = await fetchProducts(env);
    } catch (error) {
        console.warn(`  ! product pages skipped: ${error.message}`);
    }

    for (const product of products) {
        if (!product.id || !product.productName) continue;
        const route = productRoute(product);
        const outFile = path.join(DIST, route.outFile);
        await mkdir(path.dirname(outFile), { recursive: true });
        await writeFile(outFile, buildHtml(shell, route));
    }
    if (products.length > 0) {
        console.log(`  static  /product/:id (${products.length} products)`);
    }

    // 3. Sitemap (static routes + products)
    const entries = STATIC_ROUTES.filter((route) => !route.robots?.includes("noindex")).map(
        (route) =>
            sitemapEntry({
                loc: `${SITE_URL}${route.path}`,
                lastmod: today,
                changefreq: route.changefreq,
                priority: route.priority,
            })
    );
    for (const product of products) {
        if (!product.id) continue;
        entries.push(
            sitemapEntry({
                loc: `${SITE_URL}/product/${product.id}`,
                lastmod: (product.updatedAt || "").slice(0, 10) || today,
                changefreq: "weekly",
                priority: "0.7",
            })
        );
    }
    const sitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...entries,
        "</urlset>",
        "",
    ].join("\n");
    await writeFile(path.join(DIST, "sitemap.xml"), sitemap);

    console.log(`  sitemap  ${entries.length} URLs (${products.length} products)`);
}

main().catch((error) => {
    console.error("Static HTML generation failed:", error);
    process.exit(1);
});
