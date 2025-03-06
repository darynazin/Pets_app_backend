import session from 'express-session';
import MongoStore from 'connect-mongo';
import { MONGO_URI, SESSION_SECRET, NODE_ENV } from '../config/config.js';

export const authSession = session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGO_URI }),
  cookie: {
    maxAge: 1000 * 60 * 60,
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'lax',
  },
});