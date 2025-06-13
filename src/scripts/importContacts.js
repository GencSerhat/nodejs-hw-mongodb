import { Contact } from '../db/Models/Contact.js';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, 'data', 'contacts.json');

const readContacts = async () => {
  try {
    const fileContent = await readFile(filePath, 'utf-8');
    const contacts = JSON.parse(fileContent);
    console.log(contacts); // veriyi kontrol etmek için
    await Contact.insertMany(contacts);
    console.log("Veriler başarıyla MongoDB'ye aktarıldı!");
  } catch (error) {
    console.error('Dosya okunurken hata oluştu : ', error.message);
  }
};
readContacts();
