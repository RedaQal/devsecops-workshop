import crypto from 'crypto';

// VULN: MD5 est cassé, inadapté au hachage de mots de passe (pas de sel, trop rapide)
export function hashPassword(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}
