require("dotenv").config();
const express = require("express");
const Person = require("./models/person");
var morgan = require("morgan");
const cors = require("cors");
const app = express();

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

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/persons", (req, res) => {
  dbResponse = Person.find({}).then((response) => {
    res.json(response);
  });
});

app.get("/info", (req, res) => {
  dbResponse = Person.find({}).then((resp) => {
    const entries = `The phonebook has entries for ${resp.length} people`;
    const now = new Date();

    res.send(`${entries}\n${now}`);
  });
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Person.findById(id).then((response) => {
    if (response === null || response === undefined) {
      res.statusMessage = "Person not found";
      return res.status(404).end();
    } else {
      res.json(response);
    }
  });
});

app.delete("/api/persons/:id", async (req, res) => {
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
  }
});

app.post("/api/persons", (req, res) => {
  const reqPerson = req.body;

  if (!reqPerson) {
    res.status(400).json({ error: "Body is missing" });
  } else if (!reqPerson.name || !reqPerson.number) {
    res.status(400).json({ error: "name and number are required fields" });
  } else {
    Person.findOne({ name: reqPerson.name }).then((resp) => {
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
    });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running at localhost:${port}`);
});
