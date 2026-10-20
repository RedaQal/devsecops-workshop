import crypto from 'crypto';

// FIX: plus aucun secret en dur. Le secret vient de l'environnement
// (SESSION_SECRET) ou, à défaut, est généré aléatoirement au démarrage.
export const config = {
  sessionSecret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
};
