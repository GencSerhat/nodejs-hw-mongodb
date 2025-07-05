import mongoose from 'mongoose';
import { getAllContacts, getContactById } from '../services/contacts.js';
import { addContact } from '../services/contacts.js';
import createError from 'http-errors';
import { updateContactById } from '../services/contacts.js';
import { deleteContactById } from '../services/contacts.js';
import cloudinary from '../helpers/cloudinary.js';

export const addContactController = async (req, res, next) => {
  try {
    const { name, email, phoneNumber, isFavourite, contactType } = req.body;
        const { _id: userId } = req.user;

    if (!name || !contactType || !phoneNumber) {
      throw createError(400, 'Missing required fields');
    }


    // clouniary deneme
 let photoUrl = '';
console.log('Yüklenen dosya:', req.file); // test için ekledim
    if (req.file) {
        console.log('Dosya geldi, yükleniyor...'); // test için
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'contacts',
      });
      photoUrl = result.secure_url;
    }
       // clouniary deneme

    const newContact = await addContact({
      name,
      email,
      phoneNumber,
      isFavourite,
      contactType,
       userId,
       photo: photoUrl,
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
export const updateContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updateData = req.body;
    const { _id: userId } = req.user;

    if (!Object.keys(updateData).length && !req.file) {
      throw createError(400, 'Missing fields for update');
    }
 if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'contacts',
      });

      updateData.photo = result.secure_url; // 📌 Güncellenecek objeye photo URL'sini ekliyoruz
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
