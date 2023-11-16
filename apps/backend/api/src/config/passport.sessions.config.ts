import flash from 'connect-flash';
import MongoStore from 'connect-mongo';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import config from '../../config/defaults';
import User from '../models/User/user-schema';
let uri = config.mongoURI;

export default function initPassportAndSessions(app: express.Application) {
  app.use(
    session({
      secret: 'rzcodes',
      resave: false,
      saveUninitialized: false,
      cookie: {},
      name: 'sessionNameRzcodes',
      store: MongoStore.create({
        mongoUrl: uri,
      }),
    }),
  );

  app.use(flash());

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  console.log('PASSPORT and SESSIONS Loaded');
}
