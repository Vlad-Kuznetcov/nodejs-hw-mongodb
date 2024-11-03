import { contactTypeList } from '../constants/contacts.js';

const parseType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;
  const isContactType = (type) => contactTypeList.includes(type);

  if (isContactType(type)) return type;
};

const parseIsFavorite = (isFavorite) => {
  const isString = typeof isFavorite === 'string';
  if (!isString) return;

  const parseIsFavorite = isFavorite === 'true' ? true : false;

  return parseIsFavorite;
};

export const parseFilterParams = (query) => {
  const { type, isFavorite } = query;

  const parsedType = parseType(type);
  const parsedIsFavorite = parseIsFavorite(isFavorite);

  return {
    type: parsedType,
    isFavorite: parsedIsFavorite,
  };
};
