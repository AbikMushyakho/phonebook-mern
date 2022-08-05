const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}
const password = process.argv[2];

const url = `mongodb+srv://AbikMushyakho:${password}@first-cluster.xyztx.mongodb.net/fullstack?authSource=admin&replicaSet=atlas-kmg6s0-shard-0&readPreference=primary&ssl=true`;

const phonebookSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
});
const Phonebook = mongoose.model("Phonebook", phonebookSchema);

const newPerson = new Phonebook({
  id: Math.floor(Math.random() * 90000),
  name: process.argv[3],
  number: process.argv[4],
});

mongoose.connect(url).then((result) => {
  console.log("connected");
  if (process.argv.length === 3) {
    Phonebook.find({}).then((result) => {
      result.forEach((person) => {
        console.log(`${person.name} ${person.number}`);
      });
      mongoose.connection.close();
    });
  } else if (process.argv.length === 5) {
    newPerson
      .save()
      .then(() => {
        console.log(`Added ${newPerson.name} added to phonebook`);
        return mongoose.connection.close();
      })
      .catch((err) => console.log(err));
  } else {
    console.log(
      "Please provide the name as an argument: node mongo.js <password> <name>"
    );
    console.log(
      "Please provide the name as an argument: node mongo.js <password> <name> <number>"
    );
  }
});
