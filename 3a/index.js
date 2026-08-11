const express = require("express");
var morgan = require("morgan");
const app = express();

morgan.token("reqBody", (req) => {
  return `{ name: ${req.body.name}, number: ${req.body.number}}`;
});

app.use(express.json());
app.use(morgan(":method :url :status :response-time ms :reqBody"));

var persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  const entries = `The phonebook has entries for ${persons.length} people`;
  const now = new Date();

  res.send(`${entries}\n${now}`);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);

  if (person === null || person === undefined) {
    res.statusMessage = "Person not found";
    return res.status(404).end();
  } else {
    res.json(person);
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);
  res.statusMessage = "Entry Deleted";
  res.status(200).json({ message: "Entry Deleted" });
});

const getId = () => {
  var id = 0;

  if (persons.length > 0) {
    const allIds = persons.map((person) => person.id);
    id = Math.max(...allIds) + 1;
  }

  return id;
};

app.post("/api/persons", (req, res) => {
  const reqPerson = req.body;

  if (!reqPerson) {
    res.status(400).json({ error: "Body is missing" });
  } else if (!reqPerson.name || !reqPerson.number) {
    res.status(400).json({ error: "name and number are required fields" });
  } else {
    const existingPerson = persons.find(
      (person) => person.name === reqPerson.name,
    );

    if (existingPerson !== undefined) {
      res.status(400).json({ error: "This name already exists" });
    } else {
      const newPerson = {
        id: getId(),
        name: reqPerson.name,
        number: reqPerson.number,
      };
      persons = persons.concat(newPerson);
      res.json(newPerson);
    }
  }
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server running at localhost:${port}`);
});
