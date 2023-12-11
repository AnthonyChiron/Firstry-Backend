const CRUDController = require("./CRUD");
const { Category, validate } = require("../models/category");
const { Step, validate: validateStep } = require("../models/step");
const { forEach } = require("lodash");

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
    console.log(req.body);
    // Validate the category from body
    const { errorCategory } = this.validate(req.body.category);
    console.log(errorCategory);
    if (errorCategory) return res.status(400).send(error.details[0].message);

    // Create a new category in db
    const category = new Category(req.body.category);
    await category.save();

    let newCategory = {
      ...req.body.category,
      _id: category._id.toString(),
      steps: [],
    };

    let steps = [];
    req.body.steps.forEach((step) => {
      steps.push({ ...step, categoryId: newCategory._id });
    });

    // Validate the step from body
    steps.forEach((step) => {
      const { errorStep } = validateStep(step);
      console.log(errorStep);
      if (errorStep) return res.status(400).send(error.details[0].message);
    });

    // Create steps for the category
    if (newCategory.isQualificationStep) {
      const qualifStep = new Step(
        steps.find((step) => step.name == "QUALIFICATION")
      );
      await qualifStep.save();
      newCategory.steps.push(qualifStep);
    }

    const finalStep = new Step(
      steps.find((step) => step.name === "FINALE" || step.name === "")
    );
    await finalStep.save();
    newCategory.steps.push(finalStep);

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
    forEach(req.body.steps, async (step) => {
      const newStep = await Step.findByIdAndUpdate(step._id, step, {
        new: true,
      });
      console.log(step);
      console.log(newStep);
      newCategory.steps.push(newStep);
      console.log(newCategory);
    });

    console.log(newCategory);

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
};
