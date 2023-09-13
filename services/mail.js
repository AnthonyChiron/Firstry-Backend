const nodemailer = require("nodemailer");

const from = "anthony.chiron@outlook.fr";

// Créer un transporteur de messagerie SMTP
const transporter = nodemailer.createTransport({
  service: "Outlook", // Remplacez par le service de messagerie que vous utilisez
  auth: {
    user: from, // Votre adresse e-mail
    pass: "iXEk3C&2pdFJ*F", // Votre mot de passe
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
