export const unauthorized = (res) => {
  return res.status(401).send({ message: 'UNAUTHORIZED' });
};

export const notFound = (res) => {
  return res.status(404).send({ message: 'NOT FOUND' });
};

export const badRequest = (res, data) => {
  return res.status(400).send(data);
};

export const internalServerError = (res, exception, data) => {
  if (exception) console.error(exception);

  if (data) {
    return res.status(500).send(data);
  } else {
    return res.status(500).send(exception);
  }
};

export const errorHandler = (err, req, res, next) => {
  res.status(500).send({ message: 'Something went wrong', err });
};

export default {
  unauthorized,
  notFound,
  badRequest,
  internalServerError,
  errorHandler,
};
