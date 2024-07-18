const Contest = require("../models/contest");
const { Rider } = require("../models/rider");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

module.exports = class ExportController {
  exportRidersDataById = async (req, res) => {
    try {
      const riders = await Rider.find().lean().exec();

      const csvWriter = createCsvWriter({
        path: "exports/riders.csv", // Spécifiez le chemin et le nom du fichier CSV
        header: [
          { id: "firstName", title: "Prénom" },
          { id: "lastName", title: "Nom" },
          { id: "birthDate", title: "Date de naissance" },
          { id: "city", title: "Ville" },
        ],
      });

      await csvWriter.writeRecords(riders);
      console.log("Exported data");

      res.download("exports/riders.csv"); // Téléchargement du fichier CSV
    } catch (error) {
      console.log(error);
      res.status(500).send("Error exporting data to CSV");
    }
  };
};
