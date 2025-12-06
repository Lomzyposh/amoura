const sgMail = require("@sendgrid/mail");
const nodemailer = require("nodemailer");

// --- CONFIGURE SENDGRID ---
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// --- CONFIGURE SMTP BACKUP ---
const smtpTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * MAIN SENDER FUNCTION
 */
const sendEmail = async (to, subject, html) => {
  try {
    // 1️⃣ Try SendGrid First
    await sgMail.send({
      to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL, // your verified sender
        name: process.env.SENDGRID_FROM_NAME,
      },
      subject,
      html,
    });

    console.log("✅ Email sent via SendGrid");
    return true;

  } catch (error) {
    console.log("⚠️ SendGrid failed, trying SMTP...", error.message);

    try {
      // 2️⃣ Try SMTP fallback
      await smtpTransporter.sendMail({
        from: `"${process.env.SENDGRID_FROM_NAME}" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
      });

      console.log("✅ Email sent via SMTP");
      return true;

    } catch (smtpError) {
      console.error("❌ Email sending failed:", smtpError.message);
      return false;
    }
  }
};

module.exports = sendEmail;