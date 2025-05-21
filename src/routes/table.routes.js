import express from 'express';
import {
  createTable,
  getAllTables,
  getAvailableTables
} from '../controllers/table.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(verifyToken);

router.post('/', createTable);
router.get('/', getAllTables);
router.get('/available', getAvailableTables);

export default router;
