const express = require('express');
const logger = require('../utils/immutableLogger');

const router = express.Router();

// Consultation des logs (accès authentifié requis, voir server.js)
router.get('/', (req, res) => {
  res.json({ logs: logger.getAll() });
});

// Vérification d'intégrité de la chaîne de logs — démontre la détection
// de toute altération a posteriori (abuse story: modification d'un log)
router.get('/verify-integrity', (req, res) => {
  const result = logger.verifyIntegrity();
  res.json(result);
});

module.exports = router;
