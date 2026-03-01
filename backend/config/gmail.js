import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config();
// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APPPASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});



const Sendmail=async(to , otp)=>{
    console.log("📨 Sending mail to:", to);
    console.log("Using EMAIL:", process.env.EMAIL);
    const info = await transporter.sendMail({
    from: "amancollegeuse@gmail.com",
    to,
    subject: "OTP to reset password",
    text: "Hello User", // Plain-text version of the message
    html: `<p>your OTP to reset password is ${otp} . This will expires in 5 min</p>`, // HTML version of the message
  }) 
}
export default Sendmail;