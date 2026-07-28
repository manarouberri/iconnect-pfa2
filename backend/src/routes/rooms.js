const express = require('express');
const logger = require('../utils/immutableLogger');

const router = express.Router();

// ⚠️ Démonstrateur : données en mémoire. Remplacer par une vraie base en production.
let rooms = [
  { id: 1, name: 'Chambre Titouan Lamazou', status: 'available' },
  { id: 2, name: 'Chambre Karen Blixen', status: 'occupied' },
  { id: 3, name: 'Chambre Charles de Foucauld', status: 'dirty' },
  { id: 4, name: "Chambre Antoine de Saint-Exupéry", status: 'available' },
  { id: 5, name: 'Chambre Isabelle Eberhart', status: 'maintenance' },
  { id: 6, name: 'Suite Roger Frison-Roche', status: 'available' },
];

router.get('/', (req, res) => {
  res.json({ rooms });
});

const VALID_STATUSES = ['available', 'occupied', 'dirty', 'maintenance'];

router.patch('/:id', (req, res) => {
  const { status } = req.body;
  const room = rooms.find(r => r.id === parseInt(req.params.id, 10));

  if (!room) return res.status(404).json({ error: 'Chambre introuvable' });
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Statut invalide' });
  }

  const oldValue = room.status;
  room.status = status;

  logger.log({
    user: req.user.username,
    ip: req.ip,
    module: 'Rooms',
    action: 'UPDATE_STATUS',
    oldValue,
    newValue: status,
  });

  res.json({ room });
});

module.exports = router;
