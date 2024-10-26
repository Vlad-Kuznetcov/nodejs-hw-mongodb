import ContactCollection from '../bd/models/Contact.js';

export const getContacts = () => ContactCollection.find();

export const getContactById = (id) => ContactCollection.findById(id);

export const addContact = (payload) => ContactCollection.create(payload);

export const updateContact = async (_id, payload, option) => {
  const result = await ContactCollection.findByIdAndUpdate({ _id }, payload, {
    new: true,
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
