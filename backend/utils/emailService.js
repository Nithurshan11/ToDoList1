import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: Number(env.smtpPort) || 587,
      secure: false,
      auth: {
        user: env.smtpUser,
        pass: env.smtpPass
      }
    });
  }
  return transporter;
};

export const sendTaskReminderEmail = async (user, task, hoursLeft) => {
  if (!env.smtpHost || !env.smtpUser || !env.smtpPass) {
    console.warn("SMTP credentials not configured; skipping email send.");
    return;
  }

  const transport = getTransporter();

  const subject = `Reminder: "${task.title}" is due soon`;
  const due = new Date(task.dueDate);
  const dueStr = due.toLocaleString();

  const text = [
    `Hi ${user.username || user.email},`,
    "",
    `This is a friendly reminder that your task "${task.title}" is due on ${dueStr}.`,
    "",
    `Time remaining: about ${hoursLeft} hour${hoursLeft === 1 ? "" : "s"}.`,
    "",
    "Good luck staying productive!",
    "",
    "— Todo Productivity App"
  ].join("\n");

  const html = `
    <p>Hi ${user.username || user.email},</p>
    <p>This is a friendly reminder that your task <strong>${task.title}</strong> is due on <strong>${dueStr}</strong>.</p>
    <p>Time remaining: about <strong>${hoursLeft} hour${hoursLeft === 1 ? "" : "s"}</strong>.</p>
    <p>Good luck staying productive!</p>
    <p>— Todo Productivity App</p>
  `;

  await transport.sendMail({
    from: env.fromEmail,
    to: user.email,
    subject,
    text,
    html
  });
};

