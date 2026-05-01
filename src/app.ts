import express from 'express';
import morgan from 'morgan';
import expressLayout from 'express-ejs-layouts';
import path from 'node:path';
import customerRoute from './routes/customerRoute';

import flash from 'connect-flash';
import session from 'express-session';

const app = express();
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 * 7 },
  }),
);
app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan('dev'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Template Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

// Routes
app.use(customerRoute);

app.get('/*splat', (req, res) => {
  return res.status(404).send('404');
});

export default app;
