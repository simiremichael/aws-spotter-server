import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config()

// Generate a random OTP

const sendEmail = async (subject, message, send_to, send_from ) => {
  
  let transporter = nodemailer.createTransport({
   // host: process.env.EMAIL_HOST,
   // port: 587,
   // secure: false, // true for 465, false for other ports
   service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
    // tls: {
    //   rejectUnauthorized: false, // true for 465, false for other ports
    // }
  });

  const options = {
    from: send_from,
    to: send_to,
    subject: subject,
    html: message 
  }

  transporter.sendMail(options, function(err, result) {
    if(err) {
      console.log(err);
    } else {
      console.log('Email sent: ' + result.response)
    }
  });
}
export default sendEmail
