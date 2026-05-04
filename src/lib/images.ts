const allowedRemoteImageHosts = new Set(["images.unsplash.com"]);

export function detectImageType(buffer: Buffer) {
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return { contentType: "image/jpeg", extension: ".jpg" };
  }

  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { contentType: "image/png", extension: ".png" };
  }

  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return { contentType: "image/webp", extension: ".webp" };
  }

  if (
    buffer.length >= 6 &&
    ["GIF87a", "GIF89a"].includes(buffer.toString("ascii", 0, 6))
  ) {
    return { contentType: "image/gif", extension: ".gif" };
  }

  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 4, 8) === "ftyp" &&
    buffer.toString("ascii", 8, 12) === "avif"
  ) {
    return { contentType: "image/avif", extension: ".avif" };
  }

  return null;
}

export function isAllowedFeaturedImage(value: string) {
  if (!value) {
    return true;
  }

  if (value.startsWith("/uploads/")) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" && allowedRemoteImageHosts.has(url.hostname);
  } catch {
    return false;
  }
}
