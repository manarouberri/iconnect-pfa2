require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const logsRoutes = require('./routes/logs');
const { requireAuth } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// --- Sécurité globale ---
app.use(helmet()); // En-têtes de sécurité HTTP (protection XSS, clickjacking, etc.)
app.use(express.json({ limit: '1mb' })); // Limite la taille du payload (protection DoS basique)

// Rate limiting global (protection anti-DoS)
const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/logs', requireAuth, logsRoutes); // Logs accessibles uniquement authentifié

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Exemple de route protégée démontrant le contrôle d'accès (anti-IDOR)
app.get('/api/protected/ping', requireAuth, (req, res) => {
  res.json({ message: `Salut ${req.user.username}, tu es bien authentifié (2FA validé).` });
});

app.listen(PORT, () => {
  console.log(`✅ Serveur démonstrateur PFA2 lancé sur http://localhost:${PORT}`);
});
