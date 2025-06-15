import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;
const mongoUri = `mongodb+srv://admin:admin12345@contactsCluster.cydbdq3.mongodb.net/contactsDB?retryWrites=true&w=majority`;


mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Mongoose ile bağlantı başarılı!');
    process.exit();
  })
  .catch((error) => {
    console.error('Mongoose bağlantı hatası:', error.message);
    process.exit(1);
  });
