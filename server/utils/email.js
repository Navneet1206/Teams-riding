import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendRideNotification = async (captain, ride) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: captain.email,
    subject: 'New Ride Request',
    html: `
      <h2>New Ride Request</h2>
      <p>Pickup: ${ride.pickup.address}</p>
      <p>Destination: ${ride.destination.address}</p>
      <p>Distance: ${ride.distance}km</p>
      <p>Fare: ₹${ride.fare}</p>
      <p>Vehicle Type: ${ride.vehicleType}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};

export const sendRideConfirmation = async (user, ride) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: user.email,
    subject: 'Ride Confirmation',
    html: `
      <h2>Your Ride is Confirmed</h2>
      <p>Pickup: ${ride.pickup.address}</p>
      <p>Destination: ${ride.destination.address}</p>
      <p>Distance: ${ride.distance}km</p>
      <p>Fare: ₹${ride.fare}</p>
      <p>Captain Name: ${ride.captain.name}</p>
      <p>Vehicle Number: ${ride.captain.vehicleNumber}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email sending failed:', error);
  }
}; 