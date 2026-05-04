import crypto from "crypto";

const SCRYPT_PREFIX = "scrypt";
const KEY_LENGTH = 64;

function sha256(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function timingSafeHexEqual(left: string, right: string) {
  if (left.length !== right.length) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(left, "hex"), Buffer.from(right, "hex"));
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, KEY_LENGTH).toString("hex");

  return `${SCRYPT_PREFIX}$${salt}$${derivedKey}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [algorithm, salt, expectedKey] = storedHash.split("$");

  if (algorithm === SCRYPT_PREFIX && salt && expectedKey) {
    const derivedKey = crypto.scryptSync(password, salt, KEY_LENGTH).toString("hex");
    return timingSafeHexEqual(derivedKey, expectedKey);
  }

  if (/^[a-f0-9]{64}$/i.test(storedHash)) {
    return timingSafeHexEqual(sha256(password), storedHash);
  }

  return false;
}

export function needsPasswordRehash(storedHash: string) {
  return !storedHash.startsWith(`${SCRYPT_PREFIX}$`);
}
