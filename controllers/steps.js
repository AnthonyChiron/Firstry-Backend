const CRUDController = require("./CRUD");
const { Step, validate } = require("../models/step");

module.exports = class StepsController extends CRUDController {
  name = "step";
  model = Step;
  validate = validate;

  // Create steps for the category
  createSteps = async (categoryId, step) => {
    // Create a new step in db
    const newStep = new Step({
      ...step,
      categoryId,
    });
    await newStep.save();
    return newStep;
  };

  updateSteps = async (categoryId, step) => {
    // Validate the step from body
    const { error } = this.validate(step);
    if (error) return res.status(400).send(error.details[0].message);

    // Update the step in db
    const newStep = await Step.findByIdAndUpdate(
      step._id,
      {
        ...step,
        categoryId,
      },
      {
        new: true,
      }
    );

    // If step not found, send 404
    if (!newStep)
      return res
        .status(404)
        .send(`No ${this.name} found with id ${req.params.id}`);

    return newStep;
  };
};
