const { infoLogger } = require("./services/logger");
const functions = require("firebase-functions");
const express = require("express");
const fs = require("fs");
const https = require("https");
const path = require("path");

const app = express();

// SETUP
require("dotenv").config();
require("./services/logger"); // logger
require("./config/config")(); // config & env
require("./routes/routes")(app); // routes & middlewares
require("./config/db")(); // db

// Chemins vers les fichiers de certificat et clé privée
const certificatPath = "/etc/letsencrypt/live/firstry.fr/fullchain.pem";
const clePriveePath = "/etc/letsencrypt/live/firstry.fr/privkey.pem";

// Création du serveur HTTPS avec les certificats
https
  .createServer(
    {
      key: fs.readFileSync(clePriveePath),
      cert: fs.readFileSync(certificatPath),
    },
    app
  )
  .listen(443, () =>
    infoLogger.log("info", "Le serveur HTTPS écoute sur le port 443 !")
  );

// Écoute sur HTTP également, si nécessaire
const port = process.env.PORT || 3000;
app.listen(port, () =>
  infoLogger.log("info", `Le serveur HTTP est sur le port ${port}!`)
);
