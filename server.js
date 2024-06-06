const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const passport = require('passport');
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();


// Dev logging middleware
if (process.env.NODE_ENV === 'production') {
   
} else {
  dotenv.config({ path: '.env.development' });
  app.use(morgan("dev"));
}


// Connect to database
connectDB();


// Route files in
require('./auth-strategy/google-passport')(passport)


//Google Auth Stragies
const oauth = require("./routes/Auth-Strategies");
const auth = require("./routes/Auth");


const user = require("./routes/UserRoute");
const prompt = require("./routes/InteractionRoute");
const notification = require("./routes/NotificationRoute");


// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File uploading
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());



// Rate limiting
const limiter = rateLimit({
  // 10 mins
  windowMs: 10 * 60 * 1000, 
  max: 100,
});
app.use(limiter);



// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

 

// Mount routers social logins
app.use("/auth/google", oauth);
app.use("/api/v1/auth", auth);


app.use("/api/v1/interaction", prompt);


// app.use(errorHandler);


app.get('/', async (req, res) => {
  res.json({ 
   message : "Gemini and Open powered blog. GPX", 
   status : res.statusCode 
 })
});

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
});
