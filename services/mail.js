const nodemailer = require("nodemailer");
const functions = require("firebase-functions");
const from = "app@firstry.fr";

// Créer un transporteur de messagerie SMTP
const transporter = nodemailer.createTransport({
  service: "gmail", // Remplacez par le service de messagerie que vous utilisez
  auth: {
    user: from, // Votre adresse e-mail
    pass: functions.config().mail.pass, // Votre mot de passe
  },
});

module.exports.sendEmail = async function (to, subject, text, html) {
  const options = {
    from: from,
    to: to,
    subject: subject,
    text: text,
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
