import Contact from '../db/models/Contact.js';
import createError from 'http-errors';

export const getAllContacts = async (page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc',type,
  isFavourite,) => {
  const skip = (page - 1) * perPage;
  const sortOptions = {};

  if (sortBy) {
    const order = sortOrder === 'desc' ? -1 : 1;
    sortOptions[sortBy] = order;
  }
  // Filtreleme işlemi
  const filter = {};
  if (type) {
    filter.contactType = type;
  }
  if (isFavourite !== undefined) {
    filter.isFavourite = isFavourite === 'true';
  }

  const [contacts, totalItems] = await Promise.all([
    Contact.find()
      .skip(skip)
      .limit(perPage)
      .sort(sortOptions),
    Contact.countDocuments(),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};


export const getContactById = async (contactId) => {
  try {
    const contact = await Contact.findById(contactId);
    return contact;
  } catch (error) {
    console.error('Veritabanından kişi ID ile alınamadı:', error.message);
    throw error;
  }
};

export const addContact = async (contactData) => {
  const newContact = await Contact.create(contactData);
  return newContact;
};

export const updateContactById = async (contactId, updateData) => {
  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedContact) {
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
