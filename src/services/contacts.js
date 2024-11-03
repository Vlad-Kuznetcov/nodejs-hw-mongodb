import ContactCollection from '../bd/models/Contact.js';

import { calcPaginationData } from '../utils/calcPaginationData.js';

export const getContacts = async ({
  page,
  perPage: limit,
  sortBy = '_id',
  sortOrder = 'asc',
  filter = {},
}) => {
  const skip = (page - 1) * limit;

  const contactsQuery = ContactCollection.find();

  if (filter.type !== undefined) {
    contactsQuery.where('contactType').equals(filter.type);
  }

  if (filter.isFavorite !== undefined) {
    contactsQuery.where('isFavorite').equals(filter.isFavorite);
  }

  const [count, data] = await Promise.all([
    ContactCollection.find(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calcPaginationData({ count, page, perPage: limit });

  return {
    page,
    perPage: limit,
    ...paginationData,
    data,
    count,
  };
};

export const getContactById = (id) => ContactCollection.findById(id);

export const addContact = (payload) => ContactCollection.create(payload);

export const updateContact = async (_id, payload, option) => {
  const result = await ContactCollection.findByIdAndUpdate({ _id }, payload, {
    includeResultMetadata: true,
    ...option,
  });

  if (!result || !result.value) return null;

  return {
    data: result.value,
    isNew: Boolean(result.lastErrorObject.upserted),
  };
};

export const deleteContactById = (_id) =>
  ContactCollection.findByIdAndDelete({ _id });
