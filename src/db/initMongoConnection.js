import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;
const mongoUri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;
console.log('Bağlantı bilgileri:', {
  MONGODB_USER,
  MONGODB_PASSWORD,
  MONGODB_URL,
  MONGODB_DB,
  mongoUri
});

export const initMongoConnection = async () => {
    try {
        await mongoose.connect(mongoUri);
        console.log('Mongo connection successfully established!');
    } catch (error) {
        console.error("Mongo connection error:", error.message);
        process.exit(1);
    }
};










// import dotenv from 'dotenv'
// env dosyasını okumaya yarayan kütüphaneyi projeye dahil ettik.
// dotenv.config()
//  Projenin kökündeki .env dosyasını okudu
// İçindeki değişkenleri process.env nesnesine yazdı
// process.exit(0) → işler yolunda
// process.exit(1) → bir hata var → çık ve hata logla