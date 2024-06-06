const express = require('express')
const passport = require('passport')
const router = express.Router();
const jwt = require('jsonwebtoken');
const asyncHandler = require('../middleware/async');



const createToken = (_id) => {
  const jwtKey = process.env.JWT_SECRET;
  return jwt.sign({ id: _id }, jwtKey, {  expiresIn: process.env.JWT_EXPIRE });
};
 



// @desc    Auth with Google
// @route   GET /auth/google
router.get("/", passport.authenticate('google', { scope : ['profile', 'email'] }));


// @desc    Auth with Google
// @route   GET /auth/callback
router.get('/callback', passport.authenticate('google', {session: false, failureRedirect: '/auth/sign-in' }),
    asyncHandler(async (req, res, next) => {
      if (!req.user) {
        return next(new ErrorResponse('User not authenticated', 401));
      }
  
      try {
        const token = createToken(req.user.id);
        const redirectUrl = process.env.NODE_ENV === 'production' ? `${process.env.FRONTEND_URL}/auth/oauth2/redirect?encryptHased=${token}` : `${process.env.FRONTEND_URL}/auth/oauth2/redirect?encryptHased=${token}`;
        res.redirect(redirectUrl);
      } catch (err) {
        console.error('', err);
        return next(new ErrorResponse('Ooops something happened', 500));
      }
    })
);




// @desc    Auth with facebook
router.get("/facebook", passport.authenticate('facebook', { scope : ['profile', 'email'] }));

// @desc    Auth with Google
// @route   GET /auth/callback
router.get('/facebook/callback', passport.authenticate('google', {session: false, failureRedirect: '/auth/sign-in' }),
    asyncHandler(async (req, res, next) => {
      if (!req.user) {
        return next(new ErrorResponse('User not authenticated', 401));
      }
  
      try {
        const token = createToken(req.user.id);
        const redirectUrl = process.env.NODE_ENV === 'production' ? `${process.env.FRONTEND_URL}/auth/oauth2/redirect?encryptHased=${token}` : `${process.env.FRONTEND_URL}/auth/oauth2/redirect?encryptHased=${token}`;
        res.redirect(redirectUrl);
      } catch (err) {
        console.error('', err);
        return next(new ErrorResponse('Ooops something happened', 500));
      }
    })
);


module.exports = router
