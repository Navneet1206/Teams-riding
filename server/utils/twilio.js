import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendSMS = async (to, message) => {
  try {
    const response = await client.messages.create({
      body: message,
      to: `+91${to}`,  // Add country code
      from: process.env.TWILIO_PHONE_NUMBER
    });
    return response;
  } catch (error) {
    console.error('Twilio SMS error:', error);
    throw error;
  }
};
