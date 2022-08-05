const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const app = express();
const Phonebook = require("./models/phonebook");
app.use(express.json());
app.use(express.static("build"));
app.use(cors());

morgan.token("post", function (req) {
  if (req.method == "POST") {
    return JSON.stringify(req.body);
  } else {
    return "";
  }
});
morgan.format(
  "postFormat",
  ":method :url :status :res[content-length] - :response-time ms :post"
);
app.use(morgan("postFormat"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.js"));
});

app.get("/api/persons", (req, res, next) => {
  Phonebook.find({})
    .then((persons) => res.status(200).json(persons))
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  Phonebook.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).json({
          error: `Person by id ${req.params.id} not found`,
        });
      }
    })
    .catch((err) => next(err));
});

app.post("/api/persons", (req, res, next) => {
  const { name, number } = req.body;
  const newPerson = new Phonebook({
    name: name,
    number: number,
  });

  newPerson
    .save()
    .then((savedPerson) => res.status(201).json(savedPerson))
    .catch((err) => next(err));
});

app.get("/info", (req, res, next) => {
  const date = new Date();
  Phonebook.find({})
    .then((result) => {
      const entries = result.length;
      res
        .status(200)
        .send(`<p>Phonebook has info for ${entries} people <br/> ${date} </p>`);
    })
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
  let { name, number } = req.body;
  number = number ? number : "";
  Phonebook.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedPerson) => res.status(200).json(updatedPerson))
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Phonebook.findByIdAndRemove(req.params.id)
    .then((result) => res.status(204).end())
    .catch((error) => next(error));
});

const unknownEndPoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndPoint);

const errorHandler = (err, req, res, next) => {
  if (err.name === "CastError") {
    return res.status(400).send({ err: "malformatted id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ err: err.message });
  }
  next(err);
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listing on port: ${PORT}`);
});
