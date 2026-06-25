import nodemailer from "nodemailer";
import { env } from "./env.config";

/**
 * Transporter SMTP dùng chung. Với Gmail nên dùng "App Password"
 * (SMTP_HOST=smtp.gmail.com, SMTP_PORT=587, SMTP_SECURE=false).
 */
export const mailer = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE, // true cho cổng 465, false cho 587
  auth:
    env.SMTP_USER && env.SMTP_PASS
      ? { user: env.SMTP_USER, pass: env.SMTP_PASS }
      : undefined,
});

interface SendMailParams {
  to: string;
  subject: string;
  html: string;
}

export const sendMail = async ({ to, subject, html }: SendMailParams) => {
  await mailer.sendMail({
    from: env.MAIL_FROM,
    to,
    subject,
    html,
  });
};
