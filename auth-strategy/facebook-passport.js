const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
require('dotenv').config()



module.exports = function (passport) {
      passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_OAUTH_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_OAUTH_SECRET_KEY,
        callbackURL: process.env.FACEBOOK_OAUTH_CALLBACK_URL,
      },

      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ authenticationProviderId: profile.id });
          // let user = await User.findOne({ email: profile.emails[0].value });

          if (!user) {
            // Create new user if not exists
            user = await User.create({
              authenticationProviderId: profile.id,
              authenticationProvider: profile.provider,
              name: profile.name.familyName + ' ' + profile.name.givenName || profile.displayName,
              email: profile.emails[0].value,
              isActive: profile.emails[0].verified,
              profileUrl: profile.photos[0].value
            });
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }));



     // JWT strategy
      passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
      },
      async (jwtPayload, done) => {
        try {
          const user = await User.findById(jwtPayload.id);
          if (!user) {
            return done(null, false);
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }));


    };
