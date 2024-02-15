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

module.exports.uploadImg = async (file, fileName, isRemovebg) => {
  // Définir le nouveau nom de fichier avec l'extension .webp
  if (process.env.ENV !== "local") fileName = process.env.ENV + "/" + fileName;
  else fileName = "development/" + fileName;

  fileName = fileName + ".webp";
  console.log("filename: " + fileName);
  try {
    let webpBuffer = await convertToWebp(file.buffer);

    console.log("isRemovebg: " + isRemovebg);
    if (isRemovebg) webpBuffer = await removeBg(webpBuffer);

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

removeBg = async (buffer) => {
  const formData = new FormData();
  const blob = new Blob([buffer], { type: "image/webp" });
  formData.append("image_file", blob, "file.webp");

  const clipDropResponse = await fetch(
    "https://clipdrop-api.co/remove-background/v1",
    {
      method: "POST",
      headers: {
        "x-api-key": process.env.CLIPDROP_API_KEY,
      },
      body: formData,
    }
  );

  if (!clipDropResponse.ok) {
    throw new Error("Erreur lors de l'appel à ClipDrop");
  }

  const clipDropArrayBuffer = await clipDropResponse.arrayBuffer();
  const clipDropBuffer = Buffer.from(clipDropArrayBuffer);

  return await convertToWebp(clipDropBuffer);
};

convertToWebp = async (buffer) => {
  return await sharp(buffer).webp({ quality: 80 }).toBuffer();
};

module.exports.uploadFile = async (file, fileName) => {
  // Définir le nouveau nom de fichier
  if (process.env.ENV !== "local") fileName = process.env.ENV + "/" + fileName;
  else fileName = "development/" + fileName;

  try {
    const bucketFile = bucket.file(fileName);

    // Configuration des options de métadonnées pour le fichier PDF
    const options = {
      metadata: {
        contentType: "application/pdf",
      },
      public: true,
    };

    // Téléversement du fichier PDF dans le bucket
    await bucketFile.save(file.buffer, options);

    const signedUrlConfig = { action: "read", expires: "03-09-2491" };
    const [url] = await bucket.file(fileName).getSignedUrl(signedUrlConfig);

    // Retourner l'URL ou toute autre information nécessaire
    return url;
  } catch (err) {
    console.error("Erreur lors du téléversement du fichier PDF", err);
    throw err;
  }
};
