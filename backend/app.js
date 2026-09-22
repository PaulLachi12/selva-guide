import express from 'express';
import http from 'http';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import indexRouter from './src/interfaces/router/index.routes.js';
import errorHandlerMiddleware from './src/interfaces/middleware/errorHandlerMiddleware.js';
import { initSocket } from './src/interfaces/socket/index.js';
import sequelize from './src/infrastructure/config/dataBase.js';
import './src/infrastructure/models.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.PORT || 9000;

app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());

// Servir archivos subidos
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
app.use('/uploads', express.static(path.join(__dirname, uploadDir)));

app.get('/', (req, res) => res.send('API SELVAGUIDE - Guías turísticos de la Amazonía'));

app.use('/api/v1', indexRouter);

app.use(errorHandlerMiddleware);

const server = http.createServer(app);
initSocket(server);

// Verificar conexión a BD y arrancar
const iniciar = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a PostgreSQL correcta');
    server.listen(port, () => {
      console.log(`SelvaGuide API corriendo en http://localhost:${port}`);
    });
  } catch (error) {
    console.error('No se pudo conectar a PostgreSQL:', error.message);
    process.exit(1);
  }
};

iniciar();