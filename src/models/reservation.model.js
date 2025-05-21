import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import Customer from './customer.model.js';
import Table from './table.model.js';

const Reservation = db.define('Reservation', {
  id_reservation: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Customer,
      key: 'id_customer'
    }
  },
  table_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Table,
      key: 'id_table'
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  people: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('confirmed', 'cancelled'),
    defaultValue: 'confirmed',
    allowNull: false
  }
}, {
  tableName: 'reservations',
  timestamps: false
});

// Associations
Reservation.belongsTo(Customer, { foreignKey: 'customer_id' });
Reservation.belongsTo(Table, { foreignKey: 'table_id' });

export default Reservation;
