import db from '../config/db.js';

// Import models
import Admin from './admin.model.js';
import Customer from './customer.model.js';
import Table from './table.model.js';
import Reservation from './reservation.model.js';

// Setup associations
Customer.hasMany(Reservation, { foreignKey: 'customer_id' });
Reservation.belongsTo(Customer, { foreignKey: 'customer_id' });

Table.hasMany(Reservation, { foreignKey: 'table_id' });
Reservation.belongsTo(Table, { foreignKey: 'table_id' });

export {
  db,
  Admin,
  Customer,
  Table,
  Reservation
};
