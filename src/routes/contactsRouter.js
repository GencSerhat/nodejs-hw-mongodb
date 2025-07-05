import express from 'express';
import {
  updateContactByIdController,
  getAllContactsController,
  getContactByIdController,
  addContactController,
  deleteContactController,
} from '../controllers/contactsController.js';
import authenticate from '../middlewares/authenticate.js';

import validateBody from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../schemas/contactSchemas.js';
import isValidId from '../middlewares/isValidId.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import upload from '../helpers/upload.js';

const router = express.Router();
router.use(authenticate);
router.get('/', ctrlWrapper(getAllContactsController));
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));
router.post(
  '/',

  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(addContactController)
);
router.patch(
  '/:contactId',

  upload.single('photo'),
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactByIdController)
);
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default router;
