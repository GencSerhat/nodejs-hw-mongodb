
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routes/contactsRouter.js';
import { getAllContactsController } from './controllers/contactsController.js';

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use('/contacts', contactsRouter);
  app.get('/contacts', getAllContactsController);

  app.use((req, res) => {
    res.status(404).json({ message: 'notFound' });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};


// setupServer fonksiyonunu dışa aktarıyoruz (export), çünkü sonra index.js dosyasından bu fonksiyonu çağıracağız.

// express() fonksiyonu, HTTP isteklerini dinleyecek uygulamayı (app) oluşturur.

// cors() → Tarayıcıdan gelen isteklerin reddedilmemesi için gereklidir. Yoksa API çalışsa bile frontend ulaşamaz.

// pino() → Her gelen HTTP isteğini loglar. Hem pratik, hem hafif.
