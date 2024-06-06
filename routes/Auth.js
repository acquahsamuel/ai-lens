const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  accountDeactivation,
  accountBlockReactivation,
  accountActivation
} = require('../controllers/Auth');


const router = express.Router();
// const { protect, authorize } = require('../middleware/auth');



router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
// router.get('/me', protect, getMe);
// router.patch('/updateProfile', protect, updateDetails);
// router.put('/updatepassword', protect, updatePassword); 
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/activate/:activationToken', accountActivation);
router.put('/deactivateAccount', accountDeactivation);
router.put('/re-activeBlocked', accountBlockReactivation) 



module.exports = router;
