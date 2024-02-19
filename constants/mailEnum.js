module.exports.mailSubjectsEnum = {
  CONFIRM_REGISTER: "Firstry - Confirmation de votre inscription",
  NEW_EMAIL_CONFIRMATION:
    "Firstry - Confirmation de votre nouvelle adresse mail",
  NEW_PASSWORD_CONFIRMATION:
    "Firstry - Confirmation de votre nouveau mot de passe",
  RESET_PASSWORD: "Firstry - Réinitialisation de votre mot de passe",
};

module.exports.mailContentEnum = {
  CONFIRM_REGISTER: "Firstry - Confirmation de votre inscription",
  NEW_EMAIL_CONFIRMATION:
    "Veuillez cliquer sur ce lien pour confirmer votre nouvelle adresse mail : ",
  NEW_PASSWORD_CONFIRMATION:
    "Veuillez cliquer sur ce lien pour confirmer votre nouveau mot de passe : ",
  RESET_PASSWORD:
    "Veuillez cliquer sur ce lien pour réinitialiser votre mot de passe : ",
};

module.exports.confirmRegisterMail = (token, userId) => {
  return `
  <html lang="fr">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial; color: #000; background-color: #fff; }
    .container { max-width: 600px; margin: 20px auto; padding: 20px; }
    .button { background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; display: inline-block; margin-top: 10px; border-radius: 10px; }
    .footer { margin-top: 20px; font-size: 0.8rem; }
  </style>
  </head>
  <body>
    <div class="container">
      <h2>Bienvenue sur Firstry !</h2>
      <p>Nous sommes ravis de vous compter parmi nous. Avant de commencer, veuillez confirmer votre adresse email en cliquant sur le lien ci-dessous :</p>
      <a href="https://firstry.fr/account/validateEmail/${token}/${userId}" class="button">Confirmer mon email</a>
      <p class="footer">Si vous n'avez pas demandé à créer un compte sur Firstry, veuillez ignorer cet email.</p>
  
    </div>
  </body>
  </html>
`;
};

module.exports.newEmailConfirmationMail = (token, userId) => {
  return `
  <html lang="fr">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial; color: #000; background-color: #fff; }
    .container { max-width: 600px; margin: 20px auto; padding: 20px; }
    .button { background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; display: inline-block; margin-top: 10px; border-radius: 10px; }
    .footer { margin-top: 20px; font-size: 0.8rem; }
  </style>
  </head>
  <body>
    <div class="container">
      <h2>Hello !</h2>
      <p>Nous avons bien reçu votre demande de mise à jour de votre email. Veuillez confirmer votre nouvelle adresse email en cliquant sur le lien ci-dessous :</p>
      <a href="https://firstry.fr/account/validateNewEmail/${token}/${userId}" class="button">Confirmer mon email</a>
      <p class="footer">Si vous n'avez pas demandé à mettre à jour votre email, veuillez ignorer cet email.</p>  
    </div>
  </body>
  </html>
`;
};

module.exports.resetPasswordConfirmationMail = (token) => {
  return `
  <html lang="fr">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial; color: #000; background-color: #fff; }
    .container { max-width: 600px; margin: 20px auto; padding: 20px; }
    .button { background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; display: inline-block; margin-top: 10px; border-radius: 10px; }
    .footer { margin-top: 20px; font-size: 0.8rem; }
  </style>
  </head>
  <body>
    <div class="container">
      <h2>Hello !</h2>
      <p>Nous avons bien reçu votre demande de réinitialisation de votre mot de passe. Veuillez cliquer sur le lien ci-dessous pour créer votre nouveau mot de passe :</p>
      <a href="https://firstry.fr/account/resetPassword/${token}" class="button">Réinitialiser mon mot de passe</a>
      <p class="footer">Si vous n'avez pas demandé de réinitialisation de votre mot de passe, veuillez ignorer cet email.</p>  
    </div>
  </body>
  </html>
`;
};

module.exports.newPasswordConfirmationMail = (token) => {
  return `
  <html lang="fr">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial; color: #000; background-color: #fff; }
    .container { max-width: 600px; margin: 20px auto; padding: 20px; }
    .button { background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; display: inline-block; margin-top: 10px; border-radius: 10px; }
    .footer { margin-top: 20px; font-size: 0.8rem; }
  </style>
  </head>
  <body>
    <div class="container">
      <h2>Hello !</h2>
      <p>Nous avons bien reçu votre demande de réinitialisation de votre mot de passe. Veuillez cliquer sur ce lien pour confirmer votre nouveau mot de passe :</p>
      <a href="https://firstry.fr/account/validateNewPassword/${token}" class="button">Réinitialiser mon mot de passe</a>
      <p class="footer">Si vous n'avez pas demandé de réinitialisation de votre mot de passe, veuillez ignorer cet email.</p>  
    </div>
  </body>
  </html>
`;
};
