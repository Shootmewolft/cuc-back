import express from 'express';
import {
  createReservation,
  getAllReservations,
  updateReservation,
  cancelReservation
} from '../controllers/reservation.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(verifyToken);

router.post('/', createReservation);
router.get('/', getAllReservations);
router.put('/:id', updateReservation);
router.delete('/:id', cancelReservation);

export default router;
