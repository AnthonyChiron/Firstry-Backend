const XLSX = require("xlsx");
const path = require("path");
const { Registration } = require("../models/registration");
const { Rider } = require("../models/rider");
const { registrationState } = require("../constants/registrationEnum");
const { Category } = require("../models/category");
const sportsEnum = require("../constants/sportsEnum");

// Cette fonction va vérifier que les entêtes du fichier XLSX sont conformes
module.exports.verifyRiderHeaders = (buffer) => {
  // Lire le fichier à partir du buffer
  try {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    let headers = [];
    // Extraction des entêtes du fichier
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    const firstRow = range.s.r; // Première ligne

    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = { c: C, r: firstRow };
      const cell = worksheet[XLSX.utils.encode_cell(cellAddress)];
      headers.push(cell ? String(cell.v).trim() : undefined);
    }

    // Les entêtes attendues
    const expectedHeaders = [
      "#",
      "Manifestation",
      "Type",
      "Filière",
      "Groupe d'épreuve",
      "Épreuve",
      "Numéro de licence",
      "Nom",
      "Prenom",
      "Civilité",
      "Nationalité",
      "Date de naissance",
      "Sexe",
      "N°Ligue - Nom Ligue",
      "N° Département - Nom Département",
      "N° Club",
      "Nom Club",
      "Licence",
      "Discipline",
      "Sportif catégorie âge",
      "Date de début",
      "Date de fin",
      "N° - Nom Structure organisatrice",
      "Code postal manifestation",
      "Commune manifestation",
      "Date d'inscription",
      "État",
      "Commentaire",
    ];

    // Comparaison des entêtes extraites avec celles attendues
    const isValid = expectedHeaders.every((header, index) => {
      const extractedHeader = headers[index]
        ? headers[index].trim().toLowerCase()
        : "";
      const expectedHeader = header.trim().toLowerCase();

      if (expectedHeader !== extractedHeader) {
        console.log(
          `Mismatch: Expected "${header}" but found "${headers[index]}"`
        );
      }
      return expectedHeader === extractedHeader;
    });

    return isValid;
  } catch (error) {
    console.log(error);
  }
};

async function checkRegistrationExists(rider, category) {
  try {
    const registration = await Registration.findOne({
      rider: rider._id,
      category: category._id,
    });
    return registration ? true : false;
  } catch (error) {
    console.error("Erreur lors de la vérification de la registration:", error);
    throw error;
  }
}

async function checkRiderExists(licenceNumber) {
  try {
    const rider = await Rider.findOne({ licenceNumber: licenceNumber });
    return rider;
  } catch (error) {
    console.error("Erreur lors de la vérification de la fiche rider:", error);
    throw error;
  }
}

async function createRegistration(rider, category) {
  try {
    const newRegistration = new Registration({
      rider: rider._id,
      category: category._id,
      state: registrationState.VALID,
    });
    return await newRegistration.save();
  } catch (error) {
    console.error("Erreur lors de la création de la registration:", error);
    throw error;
  }
}

async function createRider(riderData) {
  try {
    const newRider = new Rider({
      firstName: riderData["Prenom"], // Adapter selon l'entête exacte
      lastName: riderData["Nom"], // Adapter selon l'entête exacte
      licenceNumber: riderData["Numéro de licence"], // Adapter selon l'entête exacte
      birthDate: riderData["Date de naissance"], // Adapter selon l'entête exacte
      sports: [sportsEnum.TROTTINETTE], // Adapter selon l'entête exacte
    });
    return await newRider.save();
  } catch (error) {
    console.error("Erreur lors de la création de la fiche rider:", error);
    throw error;
  }
}

async function processRiderImport(riderData, category) {
  const licenceNumber = riderData["Numéro de licence"]; // Adapter selon l'entête exacte

  // Vérification de l'existence d'une fiche rider
  const existingRider = await checkRiderExists(licenceNumber);

  let isRegistrationExists = null;
  if (existingRider)
    isRegistrationExists = await checkRegistrationExists(
      existingRider,
      category
    );

  if (isRegistrationExists)
    return console.log("Registration already exists for this rider.");

  if (existingRider) {
    console.log(
      `Rider exists: ${existingRider.firstName} ${existingRider.lastName}`
    );
    // Créer une registration pour ce rider existant
    await createRegistration(existingRider, category);
  } else {
    console.log(
      `Rider does not exist, creating new rider and registration for license number ${licenceNumber}`
    );
    // Créer une nouvelle fiche rider puis une registration
    const newRider = await createRider(riderData);
    await createRegistration(newRider, category);
  }
}

async function checkCategoryExists(categoryName) {
  try {
    const category = await Category.findOne({ name: categoryName });
    if (category) {
      return category;
    } else {
      console.log(
        `La catégorie "${categoryName}" n'existe pas dans la base de données.`
      );
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de la vérification de la catégorie:", error);
    throw error;
  }
}

async function removeOldRegistrations(ridersData, categoryId, contestId) {
  // Étape 2 : Extraire les numéros de licence des riders dans le fichier
  const licenseNumbersFromFile = ridersData.map(
    (riderData) => riderData["Numéro de licence"]
  );

  // Étape 3 : Récupérer les registrations actuelles pour la catégorie et le contest
  const currentRegistrations = await Registration.find({
    category: categoryId,
  }).populate({
    path: "rider",
    model: "Riders",
  });

  // Étape 4 : Extraire les numéros de licence des registrations actuelles
  const currentLicenseNumbers = currentRegistrations.map(
    (registration) => registration.rider.licenceNumber
  );

  console.log("Current license numbers:", currentLicenseNumbers);

  // Étape 5 : Trouver les numéros de licence qui existent dans la base de données mais pas dans le fichier
  const licenseNumbersToRemove = currentLicenseNumbers.filter(
    (licenseNumber) => !licenseNumbersFromFile.includes(licenseNumber)
  );

  console.log("License numbers from file:", licenseNumbersFromFile);

  if (licenseNumbersToRemove.length != 0)
    console.log("License numbers to remove:", licenseNumbersToRemove);

  // Étape 6 : Supprimer les registrations des riders absents du fichier
  await Registration.deleteMany({
    "rider.licenseNumber": { $in: licenseNumbersToRemove },
    category: categoryId,
  });
}

module.exports.importRidersFromXlsx = async (buffer, contestId) => {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const ridersData = XLSX.utils.sheet_to_json(worksheet);

  // Regrouper les inscriptions par catégorie
  const ridersByCategory = ridersData.reduce((acc, riderData) => {
    const category = riderData["Épreuve"]; // Adapter selon l'entête exacte
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(riderData);
    return acc;
  }, {});

  // Vérifier l'existence de chaque catégorie et lancer l'import si tout est valide
  for (const category in ridersByCategory) {
    const categoryFromDb = await checkCategoryExists(category);

    if (!categoryFromDb) {
      console.log(
        `La catégorie "${category}" n'existe pas. Import annulé pour cette catégorie.`
      );
      continue; // Passer à la catégorie suivante
    }

    console.log(
      "Suppression des registrations des riders absents du fichier..."
    );
    // Supprimer les anciennes registrations des riders absents du fichier
    await removeOldRegistrations(ridersData, categoryFromDb._id, contestId);
    console.log("DONE!");

    console.log(
      `Catégorie "${categoryFromDb.name}" vérifiée et existante. Démarrage de l'import...`
    );

    for (let riderData of ridersByCategory[category]) {
      await processRiderImport(riderData, categoryFromDb); // Ajout de category comme paramètre
    }
  }

  console.log("Importation terminée pour toutes les catégories valides.");
};
