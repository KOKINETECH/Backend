// src/main.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './infrastructure/webserver/routes/userRoutes';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur d’authentification prêt sur http://localhost:${PORT}`);
  console.log(`📌 Routes disponibles :`);
  console.log(`   POST   /api/auth/register`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   POST   /api/auth/refresh`);
  console.log(`   POST   /api/auth/logout`);
  console.log(`   GET    /api/auth/me (protégée)`);
});