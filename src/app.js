import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/index';
import { notFound, errorHandler } from './utils/errors';

export const app = express();
app.use(bodyParser.json());

// Import all business routes
routes.forEach((route) => app.use(route));

app.all('*', async (req, res) => {
  return notFound(res);
});

app.use(errorHandler);

export default app;
