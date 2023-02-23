import nodemailer from "nodemailer";

const smtpTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.APP_PASSWORD,
  },
});

export default smtpTransport;
