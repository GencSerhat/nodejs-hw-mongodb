import express from 'express';
import { getAllContactsController } from '../controllers/contactsController.js';
import {getContactByIdController} from '../controllers/contactsController.js';
const contactsRouter = express.Router(); //yeni bir router nesnesi oluşturduk.
    contactsRouter.get('/', getAllContactsController);
    contactsRouter.get('/:contactId',getContactByIdController);
    export default contactsRouter;
