const CRUDController = require("./CRUD");
const { Category, validate } = require("../models/category");
const { Step, validate: validateStep } = require("../models/step");
const mongoose = require("mongoose");

module.exports = class CategoriesController extends CRUDController {
  name = "category";
  model = Category;
  validate = validate;

  // Get all categories from ContestId including steps
  getAllByContestId = async (req, res) => {
    Contest.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.contestId), // Assurez-vous que la valeur est un ObjectId
        },
      },
      {
        $lookup: {
          from: "steps", // nom de la collection en minuscules
          localField: "_id", // nom du champ dans la collection `Contest`
          foreignField: "category", // nom du champ dans la collection `Category`
          as: "steps", // comment vous voulez nommer le champ dans le document résultant
        },
      },
    ])
      .then((results) => {
        res.send(results[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  createCategory = async (req, res) => {
    // Validate the category from body
    const { errorCategory } = this.validate(req.body.category);
    if (errorCategory) return res.status(400).send(error.details[0].message);

    // Create a new category in db
    const category = new Category(req.body.category);
    await category.save();

    let categoryId = category._id.toString();
    let newCategory = {
      ...category._doc,
      steps: [],
    };

    let steps = [];
    req.body.steps.forEach((step) => {
      steps.push({ ...step, categoryId: categoryId });
    });

    // Validate the step from body
    steps.forEach((step) => {
      const { errorStep } = validateStep(step);
      if (errorStep) return res.status(400).send(error.details[0].message);

      let newStep = new Step(step);
      newStep.startDate = newStep.startDate.setHours(8, 0, 0, 0);
      newStep.endDate = new Date(newStep.startDate).setHours(9, 0, 0, 0);
      newStep.save();
      newCategory.steps.push(newStep);
    });

    // Send the new category
    res.send(newCategory);
  };

  updateCategory = async (req, res) => {
    // Validate the category from body
    const { error } = this.validate(req.body.category);
    if (error) return res.status(400).send(error.details[0].message);

    // Update the category in db
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body.category,
      {
        new: true,
      }
    );

    // If category not found, send 404
    if (!category)
      return res
        .status(404)
        .send(`No ${this.name} found with id ${req.params.id}`);

    req.body.category._id = category._id;
    let newCategory = {
      ...req.body.category,
      steps: [],
    };

    // Update steps for the category
    for (let i = 0; i < req.body.steps.length; i++) {
      let step = req.body.steps[i];
      let stepId = req.body.stepsId[i];
      step.categoryId = req.params.id;

      // Validate the step from body
      const { error } = validateStep(step);
      if (error) return res.status(400).send(error.details[0].message);

      const newStep = await Step.findByIdAndUpdate(stepId, step);
      newCategory.steps.push(newStep);
    }

    // Send the updated category
    res.send(newCategory);
  };

  deleteCategory = async (req, res) => {
    // Delete the category from db
    const category = await Category.findByIdAndDelete(req.params.id);

    // If category not found, send 404
    if (!category)
      return res
        .status(404)
        .send(`No ${this.name} found with id ${req.params.id}`);

    // Delete steps from category Id
    await Step.deleteMany({ categoryId: req.params.id });

    // Send the deleted category
    res.send(category);
  };

  getAllCategoriesForRegistrations = async (req, res) => {
    // Get all categories from contestId including steps
    console.log(req.params.id);
    Category.aggregate([
      {
        $match: {
          contestId: new mongoose.Types.ObjectId(req.params.id), // Assurez-vous que la valeur est un ObjectId
        },
      },
      {
        $lookup: {
          from: "registrations", // Le nom de la collection des registrations dans MongoDB
          localField: "_id",
          foreignField: "category",
          as: "registrations",
        },
      },
      {
        $lookup: {
          from: "steps",
          localField: "_id",
          foreignField: "categoryId",
          as: "steps",
          pipeline: [
            {
              $lookup: {
                from: "rules",
                localField: "rules",
                foreignField: "_id",
                as: "rules",
              },
            },
            {
              $unwind: {
                path: "$rules",
                preserveNullAndEmptyArrays: true, // Utilisez ceci si vous voulez conserver les étapes sans règles
              },
            },
          ],
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          cashprize: 1,
          sports: 1,
          maxRiders: 1,
          registerPrice: 1,
          isQualificationStep: 1,
          contestId: 1,
          steps: 1,
          NbRegistration: { $size: "$registrations" }, // Compter le nombre de registrations
        },
      },
    ])
      .then((result) => {
        console.log(result); // Votre résultat avec NbRegistration pour chaque catégorie
        res.send(result);
      })
      .catch((err) => {
        console.error(err); // Gérer les erreurs
      });
  };

  async getNbLeftPlacesInCategory(categoryId) {
    const category = await Category.findById(categoryId);
    const registrations = await Registration.find({
      category: categoryId,
      registrationState: "valid",
    });

    return category.nbPlaces - registrations.length;
  }
};
