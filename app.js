import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './src/config/db.js';

// Rutas
import authRoutes from './src/routes/auth.routes.js';
import customersRoutes from './src/routes/customer.routes.js';
import tablesRoutes from './src/routes/table.routes.js';
import reservationsRoutes from './src/routes/reservation.routes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/tables', tablesRoutes);
app.use('/api/reservations', reservationsRoutes);

// Conexión y sincronización con base de datos
try {
  await db.authenticate();
  console.log('🔗 Connected to the database');

  await db.sync(); // Crea tablas si no existen
  console.log('📦 Database synchronized');

  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
} catch (error) {
  console.error('❌ Error connecting to the database:', error);
}
