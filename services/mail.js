const nodemailer = require("nodemailer");

const from = "anthony.chiron@outlook.fr";

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
