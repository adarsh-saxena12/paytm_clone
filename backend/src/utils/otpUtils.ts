import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendOtpEmail = async (email: string, otp: string) => {
  // Create email transporter using configured SMTP settings
  console.log("Sending OTP email to:", email);
  console.log("OTP:", otp);
  console.log("SMTP settings: ", {
    service: process.env.EMAIL_SERVICE,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
  });
  
  const transporter = nodemailer.createTransport({
    pool: true,
    service: 'hotmail',
    port: 2525,
    auth: {
      user: 'flashcartt@outlook.com',
      pass: process.env.EMAIL_PASSWORD,
    },
    maxConnections: 1
  });
  
  // Company/application name from environment variables
  const companyName = process.env.COMPANY_NAME || "Our Service";
  
  // Send professional email with HTML and plaintext versions
  await transporter.sendMail({
    from: `"${companyName}" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `${companyName} - Verification Code`,
    text: 
      `Verification Code: ${otp}\n\n` +
      `Please use this code to complete your verification process. For security reasons, this code will expire in 5 minutes.\n\n` +
      `If you did not request this code, please ignore this email.\n\n` +
      `Thank you,\n` +
      `${companyName} Security Team`,
    html: 
      `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f8f8; padding: 20px; text-align: center;">
          <h2 style="color: #333;">${companyName}</h2>
        </div>
        <div style="padding: 20px; border: 1px solid #eee;">
          <p>Hello,</p>
          <p>Your verification code is:</p>
          <div style="background-color: #f5f5f5; padding: 12px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px; margin: 15px 0;">
            ${otp}
          </div>
          <p>Please use this code to complete your verification process. For security reasons, this code will expire in <strong>5 minutes</strong>.</p>
          <p style="color: #777; font-size: 13px;">If you did not request this code, please ignore this email.</p>
        </div>
        <div style="text-align: center; padding: 15px; font-size: 12px; color: #666;">
          <p>&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
        </div>
      </div>`,
  });
};