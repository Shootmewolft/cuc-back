import express from 'express';
import {
  createCustomer,
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
  getCustomerReservations
} from '../controllers/customer.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(verifyToken);

router.post('/', createCustomer);
router.get('/', getAllCustomers);
router.get('/:id/reservations', getCustomerReservations);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

export default router;
