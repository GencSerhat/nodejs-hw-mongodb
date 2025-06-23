import express from 'express';
import {
  addContactController,
  getAllContactsController,
  getContactByIdController,
} from '../controllers/contactsController.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

router.post('/', ctrlWrapper(addContactController));
const router = express.Router();

router.get('/:contactId', getContactByIdController);

router.get('/:contactId', getContactByIdController);

router.delete('/:contactId', ctrlWrapper(deleteContactController));

export default router;
