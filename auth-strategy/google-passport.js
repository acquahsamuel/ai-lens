const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const optCode = require('otp-generator');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
require('dotenv').config()



module.exports = function (passport) {
      passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_OAUTH_CALLBACK,
        scope : [ 'profile', 'email'],
        proxy: true
      },

      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ email: profile.emails[0].value });
          if (!user) {
            // Create new user if not exists
            user = await User.create({
              authenticationProviderId: profile.id,
              authenticationProvider: profile.provider,
              name: profile.name.familyName + ' ' + profile.name.givenName || profile.displayName,
              email: profile.emails[0].value,
              isActive: profile.emails[0].verified,
              profileUrl: profile.photos[0].value,
              referralCode : optCode.generate(5)
            });
          }

          user.lastLogin = new Date();
          await user.save();

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
