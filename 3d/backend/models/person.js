const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("Connecting to db");

mongoose
  .connect(url, { family: 4 })
  .then(() => {
    console.log("Connected to db");
  })
  .catch(() => {
    console.log("Error connecting to db");
  });

const personSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: (v) => {
        return v.length >= 8 && /^\d{2,3}-\d+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid number`,
    },
  },
});

personSchema.set("toJson", {
  transform: (document, returnedDocument) => {
    returnedDocument.id = returnedDocument._id.toString();
    delete returnedDocument._id;
    delete returnedDocument._v;
  },
});

module.exports = mongoose.model("Person", personSchema);
