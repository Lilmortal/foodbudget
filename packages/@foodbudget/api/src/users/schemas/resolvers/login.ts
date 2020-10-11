import { mutationField } from '@nexus/schema';
import logger from '@foodbudget/logger';
import passport from 'passport';
import { Strategy as GoogleTokenStrategy } from 'passport-google-oauth20';
import { Context } from '../../../shared/types/ApolloServer.types';

const GoogleTokenStrategyCallback = (accessToken: any, refreshToken: any, profile: any, done: any) => done(null, {
  accessToken,
  refreshToken,
  profile,
});

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

passport.use(new GoogleTokenStrategy({
  clientID: 'your-google-client-id',
  clientSecret: 'your-google-client-secret',
  callbackURL: 'http://localhost:8080/graphql',
}, GoogleTokenStrategyCallback));

const login = mutationField('login', {
  type: 'String',
  args: {

  },
  async resolve(_parent, args, ctx: Context) {
    logger.info('login');
    await passport.authenticate('google', { session: false }, (err, data, info) => {
      if (err) Promise.reject(err);
      Promise.resolve({ data, info });
    });
  },
});

export default login;
