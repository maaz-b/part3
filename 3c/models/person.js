const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("Connecting to db");

mongoose
  .connect(url, { family: 4 })
  .then((result) => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log("Error connecting to db");
  });

personSchema = mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set("toJson", {
  transform: (document, returnedDocument) => {
    returnedDocument.id = returnedDocument._id.toString();
    delete returnedDocument._id;
    delete returnedDocument._v;
  },
});

module.exports = mongoose.model("Person", personSchema);
