import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendSMS = async (to, message) => {
  try {
    const response = await client.messages.create({
      body: message,
      to: `+91${to}`, // Add India country code
      from: process.env.TWILIO_PHONE_NUMBER
    });
    return response;
  } catch (error) {
    console.error('Twilio SMS error:', error);
    throw error;
  }
};