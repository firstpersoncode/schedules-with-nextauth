import nodemailer from "nodemailer";

export default nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  ssl: true,
  tls: true,
  auth: {
    user: process.env.NODEMAILER_TRANSPORTER,
    pass: process.env.NODEMAILER_TRANSPORTER_PASSWORD,
  },
});
