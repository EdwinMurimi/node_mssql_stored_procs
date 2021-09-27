const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD
  }
});

const sendEmail = (name, token)=>{
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: process.env.RECEIPIENT_EMAIL,
    subject: 'Sending Email using Node.js',
    html: `
      <html>
        <div style="width: 100%; height: auto; background-color: rgba(168, 50, 139, 0.3); border-radius: 5px; padding: 10px;">
          <div style="margin: 20px;">
            <h1 style="color: white;">Hello, ${name}</h1>
          </div>
          <div style="margin: 20px; color: gray; line-height: 1.6; font-size: 18px;">
            <span>Click the link below to reset your password</span>
            <br />
            <a href="http://localhost:3000/password-reset?token="+${token}
            <br />
            </div>
        </div>
      </html>
    `
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    
    if (error) console.log(error);
    console.log(`Email sent: ${info.response}`);
  
  }); 
}

module.exports = sendEmail