require("dotenv").config();
const express = require("express");
const Person = require("./models/person");
var morgan = require("morgan");
const cors = require("cors");
const app = express();

const reqErrorHandler = (err, req, res, next) => {
  console.error("reqErrorHandler: " + err.message);

  if (err.name === "CastError") {
    res.status(400).json({ message: "Malformed id" });
  }

  next(err);
};

morgan.token("reqBody", (req) => {
  if (req.method === "POST") {
    if (req.body.name && req.body.number) {
      return `{ name: ${req.body.name}, number: ${req.body.number}}`;
    } else {
      return "";
    }
  } else {
    return "";
  }
});

const corsOptions = {
  origin: "http://localhost:5173",
};

app.use(express.static("dist"));
app.use(express.json());
app.use(morgan(":method :url :status :response-time ms :reqBody"));
app.use(cors(corsOptions));

app.get("/", (req, res, next) => {
  try {
    res.send("Hello World");
  } catch (error) {
    next(error);
  }
});

app.get("/api/persons", (req, res, next) => {
  dbResponse = Person.find({})
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      next(err);
    });
});

app.get("/info", (req, res) => {
  dbResponse = Person.find({})
    .then((resp) => {
      const entries = `The phonebook has entries for ${resp.length} people`;
      const now = new Date();

      res.send(`${entries}\n${now}`);
    })
    .catch((err) => {
      next(err);
    });
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then((response) => {
      if (response === null || response === undefined) {
        res.statusMessage = "Person not found";
        return res.status(404).end();
      } else {
        res.json(response);
      }
    })
    .catch((err) => {
      next(err);
    });
});

app.delete("/api/persons/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const deletedPerson = await Person.findByIdAndDelete(id);
    if (deletedPerson) {
      res.status(200).json({ message: "Entry Deleted" });
    } else {
      console.log(" Err delete person: No entry found with that id");
    }
  } catch (error) {
    console.log(" Err delete person: " + error);
    next(error);
  }
});

app.post("/api/persons", (req, res, next) => {
  const reqPerson = req.body;

  if (!reqPerson) {
    res.status(400).json({ error: "Body is missing" });
  } else if (!reqPerson.name || !reqPerson.number) {
    res.status(400).json({ error: "name and number are required fields" });
  } else {
    Person.findOne({ name: reqPerson.name })
      .then((resp) => {
        if (!(resp === null)) {
          res.status(400).json({ error: "This name already exists" });
        } else {
          const person = Person({
            name: reqPerson.name,
            number: reqPerson.number,
          });

          person.save().then((savedPerson) => {
            res.json(savedPerson);
          });
        }
      })
      .catch((err) => {
        next(err);
      });
  }
});

app.put("/api/persons/:id", async (req, res, next) => {
  const personId = req.params.id;
  const reqPerson = req.body;

  try {
    const dbPerson = await Person.findById(personId);

    if (dbPerson === null) {
      return res.status(404).json({ message: "No person found with this id." });
    }
    dbPerson.name = reqPerson.name;
    dbPerson.number = reqPerson.number;

    const updatedPerson = await dbPerson.save();
    res.json(updatedPerson);
  } catch (error) {
    next(error);
  }
});

app.use(reqErrorHandler);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running at localhost:${port}`);
});
