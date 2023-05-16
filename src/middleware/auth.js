import { deserializeUser } from '../utils/authUtils';
import { unauthorized } from '../utils/errors';

export const withAuth = (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer ')
  ) {
    return unauthorized(res);
  }

  try {
    const { authorization } = req.headers;
    const token = authorization.slice(7, authorization.length);
    const user = deserializeUser(token);
    if (user) {
      req.user = user;
      next();
    } else {
      return unauthorized(res);
    }
  } catch (err) {
    return unauthorized(res);
  }
};
