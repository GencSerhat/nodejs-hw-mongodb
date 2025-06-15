import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Contact } from '../src/db/models/Contact.js';
import { readFile } from 'fs/promises';

dotenv.config();

const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;
const mongoUri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

const importData = async () => {
  try {
    await mongoose.connect(mongoUri);
    const data = await readFile('./data/contacts.json', 'utf-8');
    const contacts = JSON.parse(data);
    await Contact.insertMany(contacts);
    console.log('Veriler başarıyla yüklendi');
    process.exit();
  } catch (error) {
    console.error('Veri yükleme hatası:', error.message);
    process.exit(1);
  }
};
importData();
