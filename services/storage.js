const admin = require("firebase-admin");

let privateKey;

if (process.env.ENV == "development") {
  privateKey = JSON.parse(process.env.FIREBASE_PRIVATE_KEY).privateKey;
} else {
  privateKey = process.env.FIREBASE_PRIVATE_KEY.privateKey;
}

console.log(privateKey);

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    private_key: privateKey.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
  }),
  storageBucket: "gs://firstry-7e136.appspot.com/", // Remplacez par le nom de votre bucket
});

const bucket = admin.storage().bucket();

module.exports.uploadFile = async (file, fileName) => {
  // Créer un fichier dans le bucket
  const bucketFile = bucket.file(fileName);

  console.log(fileName);
  console.log(file);
  // Configuration des options de métadonnées
  const options = {
    metadata: {
      contentType: "image/png",
    },
    public: true,
  };

  // Télécharger le fichier
  await bucketFile.save(file.buffer, options);

  const signedUrlConfig = { action: "read", expires: "03-09-2491" }; // Configurer l'expiration comme vous le souhaitez
  const [url] = await bucket.file(fileName).getSignedUrl(signedUrlConfig);
  console.log(url);
  return url;
};

module.exports.getFile = async (file, fileName) => {
  // Créer un fichier dans le bucket
  const bucketFile = bucket.file(fileName);

  // Configuration des options de métadonnées
  const options = {
    metadata: {
      contentType: "image/jpg",
    },
    public: true,
  };

  // Télécharger le fichier
  await bucketFile.save(file.buffer, options);
};
