# Définir l'image de base
FROM node:18

# Définir le répertoire de travail dans le conteneur
WORKDIR ./

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier les fichiers et dossiers du projet dans le répertoire de travail
COPY . .

# Exposer le port sur lequel l'application s'exécute
EXPOSE 3000

# Définir la commande pour démarrer l'application
CMD ["node", "index.js"]
