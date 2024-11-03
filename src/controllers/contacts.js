import createHttpError from 'http-errors';
import * as contactServices from '../services/contacts.js';

// import { parseSortParams } from '../utils/parseSortParams.js';
// import { sortByListContact } from '../bd/models/Contact.js';
import { parseFilterParams } from '../utils/parseContactsFilter.js';

export const getContactsController = async (req, res) => {
  const { page, perPage, sortBy, sortOrder } = req.query;

  // const { sortBy, sortOrder } = parseSortParams({
  //   ...req.query,
  //   sortByList: sortByListContact,
  // });
  const filter = parseFilterParams(req.query);

  const data = await contactServices.getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: data,
  });
};

export const getContactByIdController = async (req, res) => {
  const { id } = req.params;
  const data = await contactServices.getContactById(id);

  if (!data) {
    throw createHttpError(404, `Contact with id=${id} not found`);
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data: data,
  });
};

export const addContactController = async (req, res) => {
  const data = await contactServices.addContact(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

export const upsertContactController = async (req, res) => {
  const { id } = req.params;
  const { data, isNew } = await contactServices.updateContact(id, req.body, {
    upsert: true,
  });

  const status = isNew ? 201 : 200;

  res.status(status).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data,
  });
};

export const patchContactController = async (req, res) => {
  const { id } = req.params;
  const { data } = await contactServices.updateContact(id, req.body);

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data,
  });
};

export const deleteContactController = async (req, res) => {
  const { id } = req.params;
  const data = await contactServices.deleteContactById(id);

  if (!data) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};
