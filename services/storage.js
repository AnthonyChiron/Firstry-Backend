const admin = require("firebase-admin");
const sharp = require("sharp");

let privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (process.env.ENV == "local") {
  privateKey = JSON.parse(process.env.FIREBASE_PRIVATE_KEY).privateKey;
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    private_key: privateKey.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
  }),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // Remplacez par le nom de votre bucket
});

const bucket = admin.storage().bucket();

module.exports.uploadFile = async (file, fileName) => {
  // Définir le nouveau nom de fichier avec l'extension .webp
  if (process.env.ENV !== "local") fileName = process.env.ENV + "/" + fileName;
  else fileName = "development/" + fileName;

  fileName = fileName + ".webp";
  console.log("filename: " + fileName);
  try {
    // Conversion de l'image en WebP
    const webpBuffer = await sharp(file.buffer)
      .webp({ quality: 80 })
      .toBuffer();

    const bucketFile = bucket.file(fileName);

    // Configuration des options de métadonnées pour le fichier WebP
    const options = {
      metadata: {
        contentType: "image/webp",
      },
      public: true,
    };

    // Téléversement du fichier WebP dans le bucket
    await bucketFile.save(webpBuffer, options);

    const signedUrlConfig = { action: "read", expires: "03-09-2491" };
    const [url] = await bucket.file(fileName).getSignedUrl(signedUrlConfig);
    console.log(url);

    // Retourner l'URL ou toute autre information nécessaire
    return url;
  } catch (err) {
    console.error(
      "Erreur lors de la conversion ou du téléversement de l'image",
      err
    );
    throw err;
  }
};
