import Contact from '../db/models/Contact.js';
import createError from 'http-errors';



export const getAllContacts = async (
  userId,
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  type,
  isFavourite
) => {
  const skip = (page - 1) * perPage;
  const sortOptions = {};

  if (sortBy) {
    const order = sortOrder === 'desc' ? -1 : 1;
    sortOptions[sortBy] = order;
  }

  // Filtreleme işlemi
  const filter = { userId }; // kullanıcıya göre filtreleme
  if (type) {
    filter.contactType = type;
  }
  if (isFavourite !== undefined) {
    filter.isFavorite = isFavourite === 'true';
  }

  const [contacts, totalItems] = await Promise.all([
    Contact.find(filter).skip(skip).limit(perPage).sort(sortOptions),
    Contact.countDocuments(filter),
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


export const addContact = async ({
  name,
  email,
  phoneNumber,
  isFavorite,
  contactType,
  userId, // userId buradan aldık
  photo,
}) => {
  const newContact = await Contact.create({
    name,
    email,
    phoneNumber,
    isFavorite,
    contactType,
    userId, // veritabanı kaydı
    photo,
  });

  return newContact;
};

export const updateContactById = async (userId, contactId, updateData) => {
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: contactId, userId }, // sadece o kullanıcıya aitse güncellenir
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedContact) {
    throw createError(404, 'Contact not found or access denied');
  }

  return updatedContact;
};


export const deleteContactById = async (userId, contactId) => {
  const deletedContact = await Contact.findOneAndDelete({
    _id: contactId,
    userId,
  });

  if (!deletedContact) {
    throw createError(404, 'Contact not found');
  }

  return deletedContact;
};
export const getContactById = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId });

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  return contact;
};