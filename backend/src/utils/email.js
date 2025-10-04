const nodemailer = require("nodemailer");

const generateRandomPassword = () => {
  return Math.random().toString(36).slice(-8); // simple generator
};

const sendPasswordEmail = async (to, name, newPass) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: "Your New Password",
      text: `Hi ${name},\n\nYour new password is: ${newPass}\n\nPlease change it after login.`
    };

    await transporter.sendMail(mailOptions);
    console.log("Password email sent to", to);
  } catch (err) {
    console.error("Email sending failed:", err);
    throw err;
  }
};

module.exports = { generateRandomPassword, sendPasswordEmail };
