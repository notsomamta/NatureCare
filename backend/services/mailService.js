// File: services/mailService.js

import nodemailer from 'nodemailer';

// --- LET'S ADD THESE LINES FOR DEBUGGING ---
console.log('--- Loading Mail Service ---');
console.log('EMAIL_USER from .env:', process.env.EMAIL_USER);
console.log('EMAIL_PASS from .env is present:', !!process.env.EMAIL_PASS); // We use !! to check if it exists without printing the actual password
// -----------------------------------------

// 1. Create a "transporter" object
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your new Gmail address from the .env file
    pass: process.env.EMAIL_PASS, // The App Password from the .env file
  },
});

// 2. Create a function to send the email
const sendReminderEmail = async (to, subject, text) => {
  const mailOptions = {
    from: `"NatureCare" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: subject,
    text: text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// 3. Export the function
export { sendReminderEmail };