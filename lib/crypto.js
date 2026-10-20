import crypto from 'crypto';

// FIX: scrypt (intégré à Node) avec sel aléatoire, à la place de MD5
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  if (typeof stored !== 'string' || !stored.includes(':')) return false;
  const [salt, hash] = stored.split(':');
  const expected = Buffer.from(hash, 'hex');
  const candidate = crypto.scryptSync(password, salt, expected.length);
  return crypto.timingSafeEqual(candidate, expected);
}
