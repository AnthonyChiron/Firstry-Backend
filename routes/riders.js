const express = require("express");
const router = express.Router();
const {
  createRider,
  findRiderById,
  deleteRiderById,
  getAllRiders,
} = require("../controllers/riders");
const Joi = require("joi");

// GET
router.get("/", (req, res) => {
  getAllRiders()
    .then((riders) => {
      res.send(riders);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.get("/:id", (req, res) => {
  findRiderById(req.params.id).then((rider) => {
    if (!rider)
      res.status(404).send("The rider with the given id was not found.");
    res.send(rider);
  });
});

// POST
router.post("/", (req, res) => {
  const { error } = validateRider(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  }

  createRider(req.body)
    .then((rider) => {
      res.send(rider);
    })
    .catch((err) => {
      res.status(400).send(err);
      next(err);
    });
});

router.delete("/:id", (req, res) => {
  deleteRiderById(req.params.id).then((rider) => {
    if (!rider)
      res.status(404).send("The rider with the given id was not found.");
    res.send(rider);
  });
});

router.put("/:id", (req, res) => {
  const rider = riders.find((c) => c.id === parseInt(req.params.id));
  if (!rider)
    res.status(404).send("The rider with the given id was not found.");

  const { error } = validateRider(rider);

  if (error) {
    res.status(400).send(error.details[0].message);
  }

  rider.name = req.body.name;
  res.send(rider);
});

function validateRider(rider) {
  const schema = Joi.object({
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    gender: Joi.string().min(2).required(),
    birthDate: Joi.date(),
    sports: Joi.array().items(Joi.string()).required(),
    category: Joi.string().min(2).required(),
    socials: Joi.object({
      instagram: Joi.string().min(3).pattern(new RegExp("^@")),
      twitter: Joi.string().min(3).pattern(new RegExp("^@")),
      youtube: Joi.string().min(3).pattern(new RegExp("^@")),
    }),
  });

  return schema.validate(rider);
}

module.exports = router;
