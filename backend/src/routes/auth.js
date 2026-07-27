const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticator } = require('otplib');
const qrcode = require('qrcode');
const rateLimit = require('express-rate-limit');
const logger = require('../utils/immutableLogger');

const router = express.Router();

// ⚠️ Démonstrateur : utilisateurs en mémoire. Remplacer par une vraie base
// (PostgreSQL/MySQL) avec requêtes paramétrées (protection injection SQL).
const users = new Map();
const failedAttempts = new Map();

// Anti brute-force sur l'authentification (abuse story: brute-force du mot de passe)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { error: 'Trop de tentatives. Réessayez dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// --- Inscription (démo) ---
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password || password.length < 12) {
    return res.status(400).json({
      error: 'Nom d\'utilisateur requis et mot de passe de 12 caractères minimum',
    });
  }
  if (users.has(username)) {
    return res.status(409).json({ error: 'Utilisateur déjà existant' });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const twoFactorSecret = authenticator.generateSecret();

  users.set(username, { username, passwordHash, twoFactorSecret, twoFactorEnabled: false });

  const otpauth = authenticator.keyuri(username, 'iConnect-PFA2', twoFactorSecret);
  const qrCodeDataUrl = await qrcode.toDataURL(otpauth);

  logger.log({
    user: username,
    ip: req.ip,
    module: 'Auth',
    action: 'REGISTER',
    newValue: { username },
  });

  res.status(201).json({
    message: 'Compte créé. Scannez le QR code avec votre application d\'authentification.',
    qrCodeDataUrl,
  });
});

// --- Étape 1 : Login (mot de passe) ---
router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;
  const user = users.get(username);

  if (!user) {
    logger.log({ user: username, ip: req.ip, module: 'Auth', action: 'LOGIN_FAILED_UNKNOWN_USER' });
    return res.status(401).json({ error: 'Identifiants invalides' });
  }

  const attempts = failedAttempts.get(username) || 0;
  if (attempts >= 5) {
    logger.log({ user: username, ip: req.ip, module: 'Auth', action: 'LOGIN_BLOCKED_ACCOUNT_LOCKED' });
    return res.status(423).json({ error: 'Compte temporairement verrouillé' });
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    failedAttempts.set(username, attempts + 1);
    logger.log({ user: username, ip: req.ip, module: 'Auth', action: 'LOGIN_FAILED_WRONG_PASSWORD' });
    return res.status(401).json({ error: 'Identifiants invalides' });
  }

  failedAttempts.delete(username);

  // Le mot de passe est bon mais l'authentification n'est PAS terminée :
  // on exige la vérification 2FA côté serveur avant de délivrer un vrai token.
  const preAuthToken = jwt.sign(
    { username, stage: 'awaiting_2fa' },
    process.env.JWT_SECRET,
    { expiresIn: '5m' }
  );

  logger.log({ user: username, ip: req.ip, module: 'Auth', action: 'LOGIN_PASSWORD_OK_AWAITING_2FA' });

  res.json({ preAuthToken, message: 'Mot de passe valide. Code 2FA requis.' });
});

// --- Étape 2 : Vérification du code 2FA (jamais côté client uniquement) ---
router.post('/verify-2fa', async (req, res) => {
  const { preAuthToken, code } = req.body;

  let payload;
  try {
    payload = jwt.verify(preAuthToken, process.env.JWT_SECRET);
  } catch {
    return res.status(403).json({ error: 'Session d\'authentification invalide ou expirée' });
  }

  if (payload.stage !== 'awaiting_2fa') {
    return res.status(403).json({ error: 'Étape 2FA non requise pour ce token' });
  }

  const user = users.get(payload.username);
  const isValidCode = authenticator.check(code, user.twoFactorSecret);

  if (!isValidCode) {
    logger.log({ user: payload.username, ip: req.ip, module: 'Auth', action: 'LOGIN_FAILED_INVALID_2FA' });
    return res.status(401).json({ error: 'Code 2FA invalide' });
  }

  const accessToken = jwt.sign(
    { username: payload.username, stage: 'fully_authenticated' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );

  logger.log({ user: payload.username, ip: req.ip, module: 'Auth', action: 'LOGIN_SUCCESS' });

  res.json({ accessToken });
});

module.exports = router;
