// Client-side image optimization helpers.
//
// 1. `optimizeImage` downscales + compresses a File before upload (canvas ->
//    WebP) so oversized photos never reach the CDN as-is.
// 2. `optimizedImageUrl` adds Cloudinary delivery transformations
//    (f_auto, q_auto, width limit) so older/existing images are also served
//    optimized without re-uploading.

const MAX_DIMENSION = 1600;
const WEBP_QUALITY = 0.82;

// Never rasterize vector graphics or animated images.
const SKIP_TYPES = ["image/svg+xml", "image/gif"];

const readImageSource = async (file) => {
    if (typeof createImageBitmap === "function") {
        try {
            return await createImageBitmap(file);
        } catch {
            // Fall through to the <img> based loader below.
        }
    }

    return await new Promise((resolve, reject) => {
        const objectUrl = URL.createObjectURL(file);
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error(`Could not read image: ${file.name}`));
        };
        image.src = objectUrl;
    });
};

/**
 * Returns a smaller WebP version of `file`, or the original file when it is
 * already small enough / cannot be processed. Never returns a bigger file.
 */
export const optimizeImage = async (
    file,
    { maxDimension = MAX_DIMENSION, quality = WEBP_QUALITY } = {}
) => {
    if (!file || !file.type || !file.type.startsWith("image/")) return file;
    if (SKIP_TYPES.includes(file.type)) return file;

    try {
        const source = await readImageSource(file);
        const sourceWidth = source.naturalWidth || source.width;
        const sourceHeight = source.naturalHeight || source.height;
        if (!sourceWidth || !sourceHeight) return file;

        const scale = Math.min(
            1,
            maxDimension / Math.max(sourceWidth, sourceHeight)
        );
        const width = Math.max(1, Math.round(sourceWidth * scale));
        const height = Math.max(1, Math.round(sourceHeight * scale));

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");
        if (!context) return file;
        context.drawImage(source, 0, 0, width, height);
        if (typeof source.close === "function") source.close();

        const blob = await new Promise((resolve) =>
            canvas.toBlob(resolve, "image/webp", quality)
        );
        if (!blob) return file;

        // Keep the original when there was nothing to shrink and we could
        // not beat the original file size.
        if (blob.size >= file.size && scale === 1) return file;

        const name = `${(file.name || "image").replace(/\.[^.]+$/, "")}.webp`;
        return new File([blob], name, { type: "image/webp" });
    } catch (error) {
        console.warn("Image optimization skipped:", error);
        return file;
    }
};

const CLOUDINARY_UPLOAD_SEGMENT = "/image/upload/";

/**
 * Adds `f_auto` + `q_auto` + a width limit to a Cloudinary delivery URL so
 * even previously uploaded (heavy) images are delivered optimized.
 * Non-Cloudinary URLs are returned untouched.
 */
export const optimizedImageUrl = (url, width = 800) => {
    if (typeof url !== "string" || !url.includes("res.cloudinary.com")) return url;
    if (!url.includes(CLOUDINARY_UPLOAD_SEGMENT)) return url;

    const afterUpload = url.split(CLOUDINARY_UPLOAD_SEGMENT)[1] || "";
    // Already has a transformation applied -> leave it alone.
    if (afterUpload.includes("f_auto") || afterUpload.includes("q_auto")) return url;

    const transformation = `f_auto,q_auto:good,w_${width},c_limit`;
    return url.replace(
        CLOUDINARY_UPLOAD_SEGMENT,
        `${CLOUDINARY_UPLOAD_SEGMENT}${transformation}/`
    );
};

/** Bytes saved by optimizing an image (never negative). */
export const getImageSavings = (originalSize, optimizedSize) =>
    Math.max(0, (Number(originalSize) || 0) - (Number(optimizedSize) || 0));

/** Human readable byte size, e.g. 1536000 -> "1.5 MB". */
export const formatBytes = (bytes) => {
    const value = Number(bytes) || 0;
    if (value < 1024) return `${value} B`;
    if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
    return `${(value / (1024 * 1024)).toFixed(1)} MB`;
};
