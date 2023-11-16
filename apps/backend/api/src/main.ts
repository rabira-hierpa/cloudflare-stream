import express from 'express';
import helmet from 'helmet';
import * as path from 'path';
import initPassportAndSessions from './config/passport.sessions.config';
import { initDB } from './db';
import initRouter from './routes/router';
import swaggerOptions from './utils/constants/swagger-options';

const app = express(),
  bodyParser = require('body-parser'),
  swaggerJsdoc = require('swagger-jsdoc'),
  swaggerUi = require('swagger-ui-express');

// Initializing  and seeding mongodb and connecting
initDB();

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(helmet());
app.disable('x-powered-by');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

initPassportAndSessions(app);

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to cloud stream API!' });
});

const port = process.env.PORT || 3333;
const specs = swaggerJsdoc(swaggerOptions);
initRouter(app);

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true }),
);

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
