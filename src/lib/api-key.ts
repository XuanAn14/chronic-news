import crypto from "crypto";

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function getPublishApiKey() {
  return process.env.PUBLISH_API_KEY || process.env.ARTICLE_API_KEY || "";
}

export function getRequestApiKey(request: Request) {
  const authorization = request.headers.get("authorization") || "";

  if (authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.slice(7).trim();
  }

  return request.headers.get("x-api-key")?.trim() || "";
}

export function verifyPublishApiKey(request: Request) {
  const expectedKey = getPublishApiKey();
  const providedKey = getRequestApiKey(request);

  if (!expectedKey || !providedKey) {
    return false;
  }

  return safeEqual(providedKey, expectedKey);
}
