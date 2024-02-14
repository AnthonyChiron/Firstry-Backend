const nodemailer = require("nodemailer");
const functions = require("firebase-functions");
const from = "app@firstry.fr";

// Créer un transporteur de messagerie SMTP
const transporter = nodemailer.createTransport({
  service: "gmail", // Remplacez par le service de messagerie que vous utilisez
  auth: {
    user: from, // Votre adresse e-mail
    pass: process.env.NODE_MAILER_PASS, // Votre mot de passe
  },
});

module.exports.sendEmail = async function (to, subject, html) {
  const options = {
    from: from,
    to: to,
    subject: subject,
    html: html,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(options, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};
