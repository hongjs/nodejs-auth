import { Router } from 'express';
import { comparePassword, serializeUser } from '../utils/authUtils';
import { hasUser, getUser, getUserCredential } from '../utils/dbUtil';
import { unauthorized, internalServerError } from '../utils/errors';

const app = Router();

app.post('/api/auth', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!hasUser(email)) return unauthorized(res);

    const { hashedPassword, salt } = getUserCredential(email);

    if (!comparePassword(password, hashedPassword, salt))
      return unauthorized(res);

    const user = await getUser(email);
    const token = serializeUser(user);
    res.send({ token });
  } catch (error) {
    internalServerError(res, error);
  }
});

export { app as authRoute };
