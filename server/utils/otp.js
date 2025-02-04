// Generate a 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create email content for OTP
export const createOTPEmail = (otp) => {
  return {
    subject: 'Verify Your Email - RideShare',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #000;">Verify Your Email</h2>
        <p>Your verification code is:</p>
        <h1 style="font-size: 32px; letter-spacing: 2px; background: #f5f5f5; padding: 10px; text-align: center;">
          ${otp}
        </h1>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>
    `
  };
};

// Create SMS content for OTP
export const createOTPMessage = (otp) => {
  return `Your RideShare verification code is: ${otp}. Valid for 10 minutes.`;
};