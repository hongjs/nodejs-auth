import { Router } from 'express';
import authUtils from '../utils/authUtils';
import dbUtil from '../utils/dbUtil';

const app = Router();

app.post('/api/auth', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!dbUtil.hasUser(username))
      return res.status(401).send({ status: 'Unauthorization' });

    const { hashedPassword, salt } = dbUtil.getUserCredential(username);

    if (!authUtils.comparePasswords(password, hashedPassword, salt))
      return res.status(401).send({ status: 'Unauthorization' });

    const user = dbUtil.getUser(username);
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

export { app as authRoute };
