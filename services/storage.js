const admin = require("firebase-admin");
const functions = require("firebase-functions");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: functions.config().config.project_id,
    private_key: functions.config().config.private_key.replace(/\\n/g, "\n"),
    client_email: functions.config().config.client_email,
  }),
  storageBucket: "gs://firstry-7e136.appspot.com/", // Remplacez par le nom de votre bucket
});

const bucket = admin.storage().bucket();

module.exports.uploadFile = async (file, fileName) => {
  // Créer un fichier dans le bucket
  const bucketFile = bucket.file(fileName);

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
