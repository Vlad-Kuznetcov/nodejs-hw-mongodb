import createHttpError from 'http-errors';
import * as contactServices from '../services/contacts.js';

// import { parseSortParams } from '../utils/parseSortParams.js';
// import { sortByListContact } from '../bd/models/Contact.js';
import { parseFilterParams } from '../utils/parseContactsFilter.js';

export const getContactsController = async (req, res) => {
  const { _id: userId } = req.user;
  const { page, perPage, sortBy, sortOrder } = req.query;
  // const { sortBy, sortOrder } = parseSortParams({
  //   ...req.query,
  //   sortByList: sortByListContact,
  // });
  const filter = parseFilterParams(req.query);
  filter.userId = userId;

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
  const { _id: userId } = req.user;
  const data = await contactServices.getContact({ _id: id, userId });

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
  const { _id: userId } = req.user;
  const data = await contactServices.addContact({ ...req.body, userId });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

export const upsertContactController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const { data, isNew } = await contactServices.updateContactOne(
    { _id: id, userId },
    { ...req.body, userId },
    {
      upsert: true,
    },
  );

  const status = isNew ? 201 : 200;

  res.status(status).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data,
  });
};

export const patchContactController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const { data } = await contactServices.updateContact(
    { _id: id, userId },
    req.body,
  );

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data,
  });
};

export const deleteContactController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const data = await contactServices.deleteContact({ _id: id, userId });

  if (!data) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};
