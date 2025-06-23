
import express from 'express';
import { updateContactByIdController } from '../controllers/contactsController.js';
import { getAllContactsController } from '../controllers/contactsController.js';
import { getContactByIdController } from '../controllers/contactsController.js';
import { addContactController } from '../controllers/contactsController.js';
import { deleteContactController } from '../controllers/contactsController.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';


const router = express.Router();
router.get('/', ctrlWrapper(getAllContactsController));
router.get('/:contactId', ctrlWrapper(getContactByIdController));
router.post('/', ctrlWrapper(addContactController));
router.patch('/:contactId', ctrlWrapper(updateContactByIdController));
router.delete('/:contactId', ctrlWrapper(deleteContactController));

export default router;

// const contactsRouter = express.Router(); //yeni bir router nesnesi oluşturduk.
//     contactsRouter.get('/', getAllContactsController);
//     contactsRouter.get('/:contactId',getContactByIdController);
