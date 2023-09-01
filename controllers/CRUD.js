module.exports = class CRUDController {
  getById = async (req, res) => {
    try {
      const result = await this.model.findById(req.params.id);
      if (!result) {
        res.status(404).send(`${this.name} not found`);
      } else {
        res.send(result);
      }
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };

  getAll = async (req, res) => {
    try {
      const results = await this.model.find();
      res.send(results);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };

  post = async (req, res) => {
    try {
      const { error } = this.validate(req.body.model);
      if (error) return res.status(400).send(error.details[0].message);

      const model = new this.model(req.body.model);

      const savedmodel = await model.save();
      res.send(savedmodel);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };

  update = async (req, res) => {
    try {
      const { error } = this.validate(req.body.model);
      if (error) return res.status(400).send(error.details[0].message);

      const result = await this.model.findByIdAndUpdate(
        req.params.id,
        req.body.model
      );
      if (!result) {
        res.status(404).send(`${this.name} not found`);
      } else {
        res.send(await this.model.findById(req.params.id));
      }
    } catch (error) {
      console.log(error);
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
      console.log(error);
      res.status(400).send(error);
    }
  };
};
