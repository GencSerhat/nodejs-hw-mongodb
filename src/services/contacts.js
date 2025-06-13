import { Contact } from "../db/Models/Contact.js";

export const getAllContacts = async () => {
    try {
        const contacts = await Contact.find();
        return contacts;
    } catch (error) {
        console.error("Veritabanından kişiler alınamadı : ",error.message);
        throw error;
    }
};
export const getContactById = async (contactId) => {
  try {
    const contact = await Contact.findById(contactId);
    return contact;
  } catch (error) {
    console.error("Veritabanından kişi ID ile alınamadı:", error.message);
    throw error;
  }
};