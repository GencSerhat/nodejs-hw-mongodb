import mongoose from 'mongoose';
import { getAllContacts, getContactById } from '../services/contacts.js';
import { addContact } from '../services/contacts.js';
import createError from 'http-errors';
import { updateContactById } from '../services/contacts.js';
import { deleteContactById } from '../services/contacts.js';

export const addContactController = async (req, res, next) => {
  try {
    const { name, email, phoneNumber, isFavorite, contactType } = req.body;
        const { _id: userId } = req.user;

    if (!name || !contactType || !phoneNumber) {
      throw createError(404, 'Missing required fields');
    }

    const newContact = await addContact({
      name,
      email,
      phoneNumber,
      isFavorite,
      contactType,
       userId,
    });

    res.status(201).json({
      status: 201,
      message: 'Succesfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};
// export const getAllContactsController = async (req, res, next) => {
//   try {
//     const { _id: userId } = req.user;
//     const { page, perPage, sortBy, sortOrder, type, isFavourite } = req.query;

//     const result = await getAllContacts({
//       page: Number(page),
//       perPage: Number(perPage),
//       sortBy,
//       sortOrder,
//        type,
//       isFavourite,
//     });

//     res.status(200).json({
//       status: 200,
//       message: 'Successfully found contacts!',
//       data: result,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
export const getAllContactsController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { page, perPage, sortBy, sortOrder, type, isFavourite } = req.query;

    const contacts = await getAllContacts(
      userId,
      Number(page),
      Number(perPage),
      sortBy,
      sortOrder,
      type,
      isFavourite
    );

    res.status(200).json({
      status: 200,
      message: 'Successfully fetched all contacts!',
      ...contacts,
    });
  } catch (error) {
    next(error);
  }
};


// export const getContactByIdController = async (req, res) => {
//   try {
//     const { contactId } = req.params;

//     // ObjectId format kontrolü
//     if (!mongoose.Types.ObjectId.isValid(contactId)) {
//       throw createError(404, 'Contact not found');
//     }

//     // Şu an burada getContactById fonksiyonunu çağıracağız (services klasöründen)
//     const contact = await getContactById(contactId);

//     if (!contact) {
//       return res.status(404).json({ message: 'Contact not found' });
//     }

//     res.status(200).json({
//       status: 200,
//       message: `Successfully found contact with id ${contactId}!`,
//       data: contact,
//     });
//   } catch (error) {
//     res.status(error.status || 500).json({
//       status: error.status || 500,
//       message: error.message || 'Internal server error',
//       data: error.message || 'Something went wrong',
//     });
//   }
// };
export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { _id: userId } = req.user;

    // ObjectId format kontrolü
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw createError(404, 'Contact not found');
    }

    const contact = await getContactById(contactId, userId);

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};
// export const updateContactByIdController = async (req, res, next) => {
//   try {
//     const { contactId } = req.params;
//     const updateData = req.body;
//     if (!Object.keys(updateData).length) {
//       return res.status(400).json({ message: 'Missing fields for update' });
//     }
//     const updatedContact = await updateContactById(contactId, updateData);
//     res.status(200).json({
//       status: 200,
//       message: 'Succesfully patched a contact! ',
//       data: updatedContact,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const updateContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updateData = req.body;
    const { _id: userId } = req.user;

    if (!Object.keys(updateData).length) {
      throw createError(400, 'Missing fields for update');
    }

    const updatedContact = await updateContactById(userId, contactId, updateData);

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};


// export const deleteContactController = async (req, res, next) => {
//   try {
//     const { contactId } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(contactId)) {
//       throw createError(404, 'Contact not found');
//     }
//     const deletedContact = await deleteContactById(contactId);

//     if (!deletedContact) {
//       throw createError(404, 'Contact not found');
//     }

//     res.status(204).send(); // No Content
//   } catch (error) {
//     next(error);
//   }
// };

export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { _id: userId } = req.user; // Kullanıcı kimliği alma kodu

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw createError(404, 'Contact not found');
    }

    const deletedContact = await deleteContactById(userId, contactId);

    if (!deletedContact) {
      throw createError(404, 'Contact not found');
    }

    res.status(204).send(); 
  } catch (error) {
    next(error);
  }
};
