import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendReservationEmail = async (toEmail, { name, date, time, people, table_id }) => {
  const mailOptions = {
    from: `"Restaurant Reservations" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: 'Reservation Confirmation',
    html: `
      <h2>Reservation Confirmed</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>Your reservation has been confirmed with the following details:</p>
      <ul>
        <li><strong>Date:</strong> ${date}</li>
        <li><strong>Time:</strong> ${time}</li>
        <li><strong>People:</strong> ${people}</li>
        <li><strong>Table Number:</strong> ${table_id}</li>
      </ul>
      <p>If you have any questions, please contact the restaurant.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Confirmation email sent to ${toEmail}`);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};

export const sendCancellationEmail = async (toEmail, { name, date, time, people, table_id }) => {
  const mailOptions = {
    from: `"Restaurant Reservations" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: 'Reservation Cancellation',
    html: `
      <h2>Reservation Cancelled</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>Your reservation has been cancelled. Here are the details of the cancelled reservation:</p>
      <ul>
        <li><strong>Date:</strong> ${date}</li>
        <li><strong>Time:</strong> ${time}</li>
        <li><strong>People:</strong> ${people}</li>
        <li><strong>Table Number:</strong> ${table_id}</li>
      </ul>
      <p>If you have any questions, please contact the restaurant.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Cancellation email sent to ${toEmail}`);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};
