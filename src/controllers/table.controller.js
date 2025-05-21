import Table from '../models/table.model.js';
import Reservation from '../models/reservation.model.js';
import { Op } from 'sequelize';
import { tableSchema } from '../schemas/table.schema.js';

export const createTable = async (req, res) => {
  const { capacity, location } = req.body;

  // Validate input
  const tableValid = tableSchema.safeParse(req.body)
  
  if (!tableValid.success) {
    return res.status(400).json({ message: 'Invalid table data', errors: tableValid.error.errors });
  }
  try {
    const newTable = await Table.create({ capacity, location, status: 'available' });
    res.status(201).json(newTable);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create table', error });
  }
};

export const getAllTables = async (req, res) => {
  try {
    const tables = await Table.findAll();
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tables', error });
  }
};

export const getAvailableTables = async (req, res) => {
  const { date, time, people } = req.query;

  if (!date || !time || !people) {
    return res.status(400).json({ message: 'Missing required query parameters: date, time, people' });
  }

  try {
    // Get all tables that are not reserved at that date and time
    const reservedTables = await Reservation.findAll({
      where: {
        date,
        time,
        status: 'confirmed'
      },
      attributes: ['table_id']
    });

    const reservedTableIds = reservedTables.map(r => r.table_id);

    const availableTables = await Table.findAll({
      where: {
        id: { [Op.notIn]: reservedTableIds },
        capacity: { [Op.gte]: people }
      }
    });

    res.json(availableTables);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch available tables', error });
  }
};
