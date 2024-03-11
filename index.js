const { infoLogger } = require("./services/logger");
const functions = require("firebase-functions");
const express = require("express");
const fs = require("fs");
const https = require("https");
const path = require("path");
const { Server } = require("socket.io");

const app = express();

// SETUP
require("dotenv").config();
require("./services/logger"); // logger
require("./config/config")(); // config & env
require("./routes/routes")(app); // routes & middlewares
require("./config/db")(); // db

let server;

// Chemins vers les fichiers de certificat et clé privée
if (process.env.ENV !== "local") {
  const certificatPath = "/etc/letsencrypt/live/firstry.fr/fullchain.pem";
  const clePriveePath = "/etc/letsencrypt/live/firstry.fr/privkey.pem";

  // Création du serveur HTTPS avec les certificats
  server = https.createServer(
    {
      key: fs.readFileSync(clePriveePath),
      cert: fs.readFileSync(certificatPath),
    },
    app
  );

  server.listen(3000, () =>
    infoLogger.log("info", "Le serveur HTTPS écoute sur le port 3000 !")
  );
} else {
  // Écoute sur HTTP localement, si nécessaire
  server = app.listen(3001, () =>
    infoLogger.log("info", `Le serveur HTTP est sur le port 3001 !`)
  );
}

// Configuration de Socket.IO pour écouter le même serveur HTTPS/HTTP
const io = new Server(server, {
  cors: {
    origin: "*", // Permet à toutes les origines. Pour une sécurité accrue, remplacez "*" par l'origine spécifique de votre client, par exemple "http://localhost:4200"
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Un utilisateur est connecté");

  socket.on("updateCurrentCategory", (data) => {
    io.emit("currentCategory", data);
  });

  socket.on("updateCurrentStep", (data) => {
    io.emit("currentStep", data);
  });

  socket.on("updateCurrentPool", (data) => {
    io.emit("currentPool", data);
  });

  socket.on("updateCurrentRiders", (data) => {
    io.emit("currentRiders", data);
  });

  socket.on("updateCurrentRider", (data) => {
    io.emit("currentRider", data);
  });

  socket.on("updateNbPools", (data) => {
    io.emit("nbPools", data);
  });
});
