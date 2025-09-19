import dotenv from "dotenv";
import { createTransport } from "nodemailer";
import path from "path";
import fs from "fs";

dotenv.config();

const tripId = "688f747bc6ba776409c94468";
const invitationToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cmlwSWQiOiI2ODhmNzQ3YmM2YmE3NzY0MDljOTQ0NjgiLCJpYXQiOjE3NTQ1NzgwMTcsImV4cCI6MTc1NDU4MTYxN30.extIK2KQTeP0Otk6BfU-xMWGGr4CL_YZsXMvNEycGw4";

const inviteUrl = `http://localhost:3000/trips/${tripId}/invite/accept?token=${invitationToken}`;

export const sendMail = async (email, subject, data) => {
  const templatePath = path.join(
    process.cwd(),
    "src",
    "templates",
    "accept-invite.html"
  );
  let html = fs.readFileSync(templatePath, "utf8");
  html = html
    .replace(/{{\s*link\s*}}/g, data.link)
    .replace(/{{\s*title\s*}}/g, data.title)
    .replace(/{{\s*startDate\s*}}/g, data.startDate)
    .replace(/{{\s*endDate\s*}}/g, data.endDate)
    .replace(/{{\s*userName\s*}}/g, data.userName);

  const transporter = createTransport({
    // host: process.env.MAIL_HOST,
    // PORT: process.env.MAIL_PORT,
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: email.join(","), //this helps one can send email to multiple email means the multiple email array will be joined and treat as a seperate
    subject,
    // text, //task (2082-04-22):in place of text send html template  in html there should be link and the html should be sent in the mail
    html,
  };
  await transporter.sendMail(mailOptions);
};
