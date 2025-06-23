import Contact from "../db/models/Contact.js";
import createError from 'http-errors';

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

export const addContact = async (contactData) => {
  const newContact = await Contact.create(contactData);
  return newContact;
};

export const updateContactById= async (contactId, updateData) => {
  const updatedContact = await Contact.findByIdAndUpdate(contactId, updateData, {
    new:true,
    runValidators:true,
  });
  if(!updatedContact) {
    throw createError(404, 'Contact not found');
  }
  return updatedContact;
};



export const deleteContactById = async (contactId) => {
  const deletedContact = await Contact.findByIdAndDelete(contactId);
  
  if (!deletedContact) {
    throw createError(404, 'Contact not found');
  }

  return deletedContact;
};

// findByIdAndUpdate ile veritabanında kişiyi güncelledik.
// runValidators: true şema kurallarını uygulaması için