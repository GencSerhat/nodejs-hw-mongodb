import cookieParser from 'cookie-parser';
import express from 'express';
import logger from 'pino-http';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import contactsRouter from './routes/contactsRouter.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import authRouter from './routes/auth.js'; 

dotenv.config();
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

app.use(notFoundHandler);
app.use(errorHandler);
