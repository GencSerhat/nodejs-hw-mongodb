import express from 'express';

// denemeler yapıyorum

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });


// denemeler yapıyorum
console.log('JWT_SECRET:', process.env.JWT_SECRET); // test için ekledim
import cookieParser from 'cookie-parser';

import logger from 'pino-http';

import mongoose from 'mongoose';

import contactsRouter from './routes/contactsRouter.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import authRouter from './routes/auth.js'; 


import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
const swaggerDocument = YAML.load(path.resolve(__dirname, '../docs/openapi.yaml'));


const app = express();
app.use(cookieParser());
app.use(logger());
app.use(express.json());
app.use('/auth', authRouter);
app.use('/contacts', contactsRouter);
const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;
const mongoUri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Mongo connection succesfully estabilshed!');
    app.listen(3000, () => {
      console.log('Serves is running on port 3000');
    });
  })
  .catch((error) => {
    console.error('Mongoose bağlantı hatası : ', error.message);
  });



  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(notFoundHandler);
app.use(errorHandler);
