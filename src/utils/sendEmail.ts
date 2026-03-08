import nodemailer from "nodemailer";
import { env } from "../config/env";

export const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject,
    html,
  });

  console.log("Email sent:", info.messageId);
};
// import nodemailer from "nodemailer";

// export const sendEmail = async (to: string, subject: string, html: string) => {
//   console.log("EMAIL_USER:", process.env.EMAIL_USER);
//   console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
//   console.log("EMAIL_FROM:", process.env.EMAIL_FROM);

//   const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   const info = await transporter.sendMail({
//     from: process.env.EMAIL_FROM,
//     to,
//     subject,
//     html,
//   });

//   console.log("Email sent:", info.messageId);
// };