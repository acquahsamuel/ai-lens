// require('dotenv').config()
const dotenv = require('dotenv');
const hbs = require('nodemailer-express-handlebars')
const nodemailer = require('nodemailer');
const path = require("path");

 

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({

    host: process.env.SMTP_HOST_GMAIL,
    port:  process.env.SMTP_PORT_GMAIL,
    // secure: true,
    auth: {
      user:  process.env.SMTP_USER_GMAIL,
      pass:  process.env.SMTP_PASSWORD_GMAIL
    }
    // host: process.env.SMTP_HOST_ZOHO,
    // port:  process.env.SMTP_PORT_ZOHO,
    // secure: true,
    // auth: {
    //   user:  process.env.SMTP_USER_ZOHO,
    //   pass:  process.env.SMTP_PASSWORD_ZOHO
    // }
  });

  

  // point to the template folder
  const handlebarOptions = {
    viewEngine: {
      extName: ".hbs",
      partialsDir: path.resolve("./public/templates"),
      defaultLayout: false,
    },
    viewPath: path.resolve("./public/templates"),
    extName: ".hbs",
  };
  
  // use a template file with nodemailer
  transporter.use('compile', hbs(handlebarOptions))
 

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject :       options.subject,
    template :      options.template,
    context:{
      name :        options?.message?.name,
      link :        options?.message?.link,
      title :       options?.message?.title,
      code :        options?.message?.code,
      image :       options?.message?.image,
      status :      options?.message?.status,
      date :        options?.message?.date,
      deviceName :  options?.message?.deviceName,
      browser :     options?.message?.browser,
      message:      options?.message
    },
  };

  const info = await transporter.sendMail(message);
  // console.log(info, 'info');
};




module.exports = sendEmail ;
