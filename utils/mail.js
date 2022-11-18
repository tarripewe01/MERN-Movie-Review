const nodemailer = require("nodemailer");

exports.generateOTP = (otp_length = 6) => {
  // generate 6 digit otp
  let OTP = "";
  for (let i = 1; i <= otp_length; i++) {
    const randomVal = Math.round(Math.random() * 9);
    OTP += randomVal;
  }

  return OTP;
};

exports.generateMailTransporter = () => {
  nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "655df9fe8df911",
      pass: "47b0c492b4f3af",
    },
  });
};
