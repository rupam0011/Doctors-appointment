import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    // Create a test account using Ethereal (fake SMTP for development)
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: '"Doctor Booking System" <noreply@doctorbooking.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    // Log the preview URL so we can verify the email was "sent"
    console.log("📧 Email sent successfully!");
    console.log("📧 Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

export default sendEmail;
