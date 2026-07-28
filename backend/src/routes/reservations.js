const express = require('express');
const logger = require('../utils/immutableLogger');

const router = express.Router();

// ⚠️ Démonstrateur : données en mémoire.
let reservations = [];
let nextId = 1;

router.get('/', (req, res) => {
  res.json({ reservations });
});

router.post('/', (req, res) => {
  const { guestName, roomId, checkIn, checkOut } = req.body;

  if (!guestName || !roomId || !checkIn || !checkOut) {
    return res.status(400).json({ error: 'Tous les champs sont requis (guestName, roomId, checkIn, checkOut)' });
  }

  const reservation = {
    id: nextId++,
    guestName,
    roomId: parseInt(roomId, 10),
    checkIn,
    checkOut,
    status: 'active',
    createdAt: new Date().toISOString(),
  };
  reservations.push(reservation);

  logger.log({
    user: req.user.username,
    ip: req.ip,
    module: 'Reservations',
    action: 'CREATE',
    newValue: { guestName, roomId, checkIn, checkOut },
  });

  res.status(201).json({ reservation });
});

router.post('/:id/checkout', (req, res) => {
  const reservation = reservations.find(r => r.id === parseInt(req.params.id, 10));
  if (!reservation) return res.status(404).json({ error: 'Réservation introuvable' });

  reservation.status = 'checked_out';

  logger.log({
    user: req.user.username,
    ip: req.ip,
    module: 'Reservations',
    action: 'CHECKOUT',
    oldValue: 'active',
    newValue: 'checked_out',
  });

  res.json({ reservation });
});

module.exports = router;
