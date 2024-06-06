const crypto = require("crypto");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpCode = require("otp-generator");
const { generateRandomString } = require('../utils/helper-function');
const OPTLENGTH = 5;


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  email: {
    type: String,
    required: [true, "Please add an email"],
    trim: true,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },


  /**
   * Primary mobile number
   */
  mobile: {
    type: String,
    trim: true,
    required: false,
  },


   /**
   * Secondary number
   */
  secondaryMobile: {
    type: Number,
    trim: true,
    required: false,
  },


  role: {
    type: String,
    enum: ["user", "business", "developer", "admin", "superadmin"],
    default: "user",
  },

  activationToken: {
    type: String,
    required: false,
  },

  profileUrl: {
    type: String
  },

  isActive: {
    type: Boolean,
    default: true,
    // default: false
  },

  accountType: {
    type: String,
    default: "basic",
    enum: ["basic", "regular", "premium", "enterprise"],
    required: true,
  },


  gender : {
    type : String
  },

  
  /**
   * Review code integrate with extenral API
   * Margins API, external KYC services
   */
  validIdNumber :{
    // unique : true, 
    type : String,
    min: 10
  },


  interests: [
    { type: String }
  ] ,

  authenticationProvider: {
    type: String,
  },

  authenticationProviderId: {
    type : String
  },

  referralCode: {
    type : String
  },

  referredBy: {
    type : String
  },

  referralURL: {
    type : String
  },

  resetPasswordToken: {
    type : String
  },

  resetPasswordExpire: {
    type : Date
  },


 
  bookmarks: [{
     type: Schema.Types.ObjectId,
      ref: "Bookmark" 
  }],

  
  password: {
    type: String,
    select: false,
  },

  businessConfigured :{
    type: Boolean,
    default: false,
  },

  phoneActivated: {
    type: Boolean,
    default: false,
  },

  dateOfBirth : {
    type : Date  
  },

  userVerifiedById :{
    type: Boolean,
    default: false
  },

  
  userSubdomain : {
    type : String
  },

  trendaSubdomain : {
    type : String
  },

  location : {
    type : String
  },

  accountCreatedAt: {
    type: Date,
    default: Date.now,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  lastLogin: {
    type: Date,
    default: Date.now,
  },

  deviceIpAddress : {
    type : String
  }
});




// Referral Code generation
UserSchema.post("save", async function (next) {
  const code = otpCode.generate(OPTLENGTH, {
    digits: true,
    specialChars: false,
    alphabets: false,
    upperCase: false,
  });
  this.referralCode = code;
});



 
// UserSchema.pre("save", async function (next) {
//   if (this.isModified("name") || !this.userSubdomain) {
//     let subdomain = this.name.replace(/\s+/g, "-").toLowerCase();
//     subdomain = `${subdomain}-${generateRandomString(9)}`;
//     let count = 1;
//     while (await this.constructor.findOne({ userSubdomain: subdomain })) {
//       subdomain = `${this.name.replace(/\s+/g, "-").toLowerCase()}-${count}`;
//       count++;
//     }
//     this.userSubdomain = subdomain;
//     this.trendaSubdomain =  `${process.env.FRONTEND_URL}/@${subdomain}`;
//   }
//   next();
// });




//Generate referal link

// UserSchema.pre("save", function (next) {
//   const linkPart = [this.name, this.referralCode].filter(Boolean).join("-");
//   this.referralURL = linkPart.toLowerCase().replace(/\s+/g, "-");
//   next();
// });



// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);


