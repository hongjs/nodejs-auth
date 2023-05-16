import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/index';

export const app = express();
app.use(bodyParser.json());

// Import all business routes
routes.forEach((route) => app.use(route));

export default app;
