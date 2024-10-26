import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';

import * as contactControllers from '../controllers/contacts.js';

const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(contactControllers.getContactsController));

contactsRouter.get(
  '/:id',
  isValidId,
  ctrlWrapper(contactControllers.getContactByIdController),
);

contactsRouter.post('/', ctrlWrapper(contactControllers.addContactController));

contactsRouter.put(
  '/:id',
  ctrlWrapper(contactControllers.upsertContactController),
);

contactsRouter.patch(
  '/:id',
  ctrlWrapper(contactControllers.patchContactController),
);

contactsRouter.delete(
  '/:id',
  ctrlWrapper(contactControllers.deleteContactController),
);

export default contactsRouter;
