const crypto = require('crypto');
const format = require('date-fns/format');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');
const deviceDetector = require('node-device-detector');
 

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
  let {   email, password } = req.body;

//   email = email.toLowerCase();
//   name =  name.toLowerCase();

  const userExmail = await User.findOne({ email });
//   const userByMobile = await User.findOne({ mobile });


  if (userExmail) {
    return next(new ErrorResponse('User with this email already exist', 400));
  }

//   if (userByMobile) {
//     return next(new ErrorResponse('User with this mobile number already exists', 400));
//   }

  const activationToken = generateRandomToken();

  // Create user
  const user = await User.create({

    email,
    password,
    activationToken,
  });

  await user.save({ validateBeforeSave: false });

 
  //const activateURL
  const activateURL = `${process.env.FRONTEND_URL}/auth/activate/?token=${activationToken}`;
  try {
    res.status(200).json({ success: true,  message : 'Account created successfully. Please activate your account, confirm email used in creating account. Thank you'});

    await sendEmail({
      email: user.email,
      subject: 'Activate Your Account Trenda',
      message : { 
        name : user.name,
        link : activateURL
      },
      template : 'account-activation'
    });
  } catch (err) {}
});



// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  let { email, password } = req.body;

  email = email.toLowerCase();
  console.log('ACCOUNT EMAIL LOGIN::::::::::::::::', email);

  // Validate emil & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

   // Check if the user account is active
   if (!user.isActive) {
    return next(new ErrorResponse('Account is not active. Please activate your account.', 401));
  }


   user.lastLogin = new Date();
   await user.save();

 
  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);

  const detector = new deviceDetector({
    clientIndexes: true,
    deviceIndexes: true,
    deviceAliasCode: false,
  });

  const userAgent = req.headers['user-agent'];
  const deviceDetails = detector.detect(userAgent);
  const loginTime = format(new Date(), 'EEE MMM dd yyyy HH:mm:ss a');
 

  await sendEmail({
    email: user.email,
    subject: 'Login notification',
    message : { 
      name : user.name,
      date :   loginTime,
      deviceName :  deviceDetails.os.name,
      browser: `${deviceDetails.client.family} ${deviceDetails.client.type}`,
    },
    template : 'login-notification'
  });
});


// @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    messsage : "Logged out",
    data: {}
  });
});


// @desc      Get current logged in user
// @route     POST /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    data: user
  });
});




// @desc      Update user details
// @route     PUT /api/v1/auth/updatedetails
// @access    Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const {gender, mobile, validIdNumber,profileUrl, interests, idType, dateOfBirth } = req.body;
  let userVerifiedById = validIdNumber?.length >= 10;

  const fieldsToUpdate = {};

 
  // Add provided fields to the fieldsToUpdate object
  if (gender !== undefined) fieldsToUpdate.gender = gender;
  if (mobile !== undefined) fieldsToUpdate.mobile = mobile;
  if (validIdNumber !== undefined) fieldsToUpdate.validIdNumber = validIdNumber;
  if (profileUrl !== undefined) fieldsToUpdate.profileUrl = profileUrl;
  if (interests !== undefined) fieldsToUpdate.interests = interests;
  if (idType !== undefined) fieldsToUpdate.idType = idType;
  if (dateOfBirth !== undefined) fieldsToUpdate.dateOfBirth = dateOfBirth;
  if (userVerifiedById !== undefined) fieldsToUpdate.userVerifiedById = userVerifiedById;

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: false
  });

 
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  // Return updated user
  res.status(200).json({ success: true, data: user });

});


 

// @desc      Update password
// @route     PUT /api/v1/auth/updatepassword
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();
  sendTokenResponse(user, 200, res);
});



// @desc      Forgot password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email});
  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }
  

  // Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  //const resetURL
  const resetUrl = `${process.env.FRONTEND_URL}/auth/resetpassword/?token=${resetToken}`;
  try {

    await sendEmail({
      email: user.email,
      subject: 'Password Reset',
      message :{
        link : resetUrl
      },
      template : 'password-reset'
    });

    res.status(200).json({ success: true, message : 'Email sent successfully' });
    
  } catch (err) {
    // console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse('Email could not be sent', 500));
  }
});






// @desc      Deactivate Account
// @route     PUT /api/v1/auth/deactivateUserByEmail
// @access    Public
exports.accountDeactivation = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse('User Email not found.', 404));
  }

  // Update the user's account status to inactive
  user.isActive = false;
  await user.save();
  res.status(200).json({
    success: true,
    message: 'Account deactivated successfully.'
  });
});



// @desc      Deactivate Account
// @route     PUT /api/v1/auth/reactiveBlockedUserByEmail
// @access    Public
exports.accountBlockReactivation = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse('User Email not found.', 404));
  }

  // Update the user's account status to inactive
  user.isActive = true;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Account restored successfully.'
  });
});



// @desc      Activate Account 
// @route     PUT /api/v1/auth/activate/:activationToken
// @access    Public
exports.accountActivation = asyncHandler(async (req, res, next) => {
  const { activationToken } = req.params;

  // Find the user with the given activation token
  const user = await User.findOne({ activationToken });
  
   // Check if the activation token in the query parameters matches the one in the database
   if (!user || activationToken !== user.activationToken) {
     return next(new ErrorResponse('Invalid activation token.', 400));
   }


   // Update the user's account status to active
   user.isActive = true;
   user.activationToken = undefined;

   await user.save();

   res.status(200).json({
    success: true,
    message : 'Account activated successfully.'
  })

   
   await sendEmail({ 
    email: user.email, 
    subject: 'Welcome to Trenda! ',
    message : { 
      name : user.name
    },
    template : 'welcome'
   });
})




// @desc      Reset password
// @route     PUT /api/v1/auth/resetpassword/:resettoken
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendTokenResponse(user, 200, res);
});



// @desc      Delete user account
// @route     PUT /api/v1/auth/deleteAccount
// @access    Public



 
// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
};


const generateRandomToken = () => {
  const randomBytes = crypto.randomBytes(64);
  const randomString = randomBytes.toString('hex');
  const hashedString = crypto.createHash('sha256').update(randomString).digest('hex');
  // Return the hashed string
  return hashedString;
};

