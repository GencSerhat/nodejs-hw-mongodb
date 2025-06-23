import express from 'express';
import logger from 'pino-http';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
// import cors from 'cors';
// import pino from 'pino-http';
import contactsRouter from './routes/contactsRouter.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
// import { getAllContactsController } from './controllers/contactsController.js';
dotenv.config();
const app = express();
app.use(logger());
app.use(express.json());
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










// export const setupServer = () => {

//   app.use(cors());
//   app.use(pino());
//   app.use('/contacts', contactsRouter);
//   app.get('/contacts', getAllContactsController);

//   app.use((req, res) => {
//     res.status(404).json({ message: 'notFound' });
//   });

//   const PORT = process.env.PORT || 3000;
//   app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   });
// };

// setupServer fonksiyonunu dışa aktarıyoruz (export), çünkü sonra index.js dosyasından bu fonksiyonu çağıracağız.

// express() fonksiyonu, HTTP isteklerini dinleyecek uygulamayı (app) oluşturur.

// cors() → Tarayıcıdan gelen isteklerin reddedilmemesi için gereklidir. Yoksa API çalışsa bile frontend ulaşamaz.

// pino() → Her gelen HTTP isteğini loglar. Hem pratik, hem hafif.
