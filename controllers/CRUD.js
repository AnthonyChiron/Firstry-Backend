module.exports = class CRUDController {
  getById = async (req, res) => {
    const result = await this.model.findById(req.params.id);
    if (!result) {
      return res.status(404).send(`${this.name} not found`);
    }
    res.send(result);
  };

  getAll = async (req, res) => {
    const results = await this.model.find();
    res.send(results);
  };

  post = async (req, res) => {
    console.log(req.body);
    const { error } = this.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const model = new this.model(req.body);

    const savedmodel = await model.save();
    res.send(savedmodel);
  };

  update = async (req, res) => {
    const { error } = this.validate(req.body);
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
  };

  deleteById = async (req, res) => {
    const result = await this.model.findByIdAndDelete(req.params.id);
    if (!result) {
      res.status(404).send(`${this.name} not found`);
    } else {
      res.send(result);
    }
  };
};
