import { Router } from 'express';
import dbUtil from '../utils/dbUtil';
import { internalServerError, badRequest } from '../utils/errors';
import { withAuth } from '../middleware/auth';

const app = Router();

app.get('/api/user/list', withAuth, (req, res) => {
  try {
    const users = dbUtil.getUsers();
    res.send(users);
  } catch (error) {
    internalServerError(res, error);
  }
});

app.post('/api/user', withAuth, async (req, res) => {
  const { email, password, password2, name } = req.body;
  if (password !== password2)
    return badRequest(res, { message: 'Password mismatch' });
  if (dbUtil.hasUser(email))
    return badRequest(res, { message: 'email exists' });

  try {
    const user = await dbUtil.addUser(email, password, name);
    res.send(user);
  } catch (error) {
    console.error(error);
    internalServerError(res, error);
  }
});

export { app as userRoute };
