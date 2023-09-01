/** @type {import("mongoose:Model")} */
const { Contest, validate } = require("../models/contest");

module.exports = class CRUDController {
  post = async (req, res) => {
    try {
      const { error } = this.validate(req.body.model);
      if (error) return res.status(400).send(error.details[0].message);

      const model = new this.model(req.body.model);

      const savedmodel = await model.save();
      res.send(savedmodel);
    } catch (error) {
      res.status(400).send(error);
    }
  };

  deleteById = async (req, res) => {
    try {
      const result = await this.model.findByIdAndDelete(req.params.id);
      if (!result) {
        res.status(404).send(`${this.name} not found`);
      } else {
        res.send(result);
      }
    } catch (error) {
      res.status(400).send(error);
    }
  };

  update = async (req, res) => {
    try {
      const { error } = validate(req.body.model);
      if (error) return res.status(400).send(error.details[0].message);

      const result = await this.model.findByIdAndUpdate(
        req.params.id,
        req.body
      );
      if (!result) {
        res.status(404).send(`${this.name} not found`);
      } else {
        res.send(await this.model.findById(req.params.id));
      }
    } catch (error) {
      res.status(400).send(error);
    }
  };

  getById = async (req, res) => {
    try {
      const result = await this.model.findById(req.params.id);
      if (!result) {
        res.status(404).send(`${this.name} not found`);
      } else {
        res.send(result);
      }
    } catch (error) {
      res.status(400).send(error);
    }
  };

  getAll = async (req, res) => {
    try {
      const results = await this.model.find();
      res.send(results);
    } catch (error) {
      res.status(400).send(error);
    }
  };
};
