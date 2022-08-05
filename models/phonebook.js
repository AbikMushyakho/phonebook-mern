const mongoose = require("mongoose");
const url = process.env.MONGODB_URL;
console.log("connecting to", url);
mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

  const validateNumber = [
    {
      // Minimum length validator
      validator: (number) => {
        if ((number[2] === "-" || number[3] === "-") && number.length < 9) {
          return false;
        }
        return true;
      },
      msg: "Phone number must be at least 8 digits",
    },
    {
      // Regex validator which allows only numbers
      validator: (number) => {
        // regex.test return true/false
        return /^\d{2,3}-\d+$/.test(number);
      },
      msg: "Invalid phone number",
    },
  ];
  
const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: validateNumber,
    required: true,
  },
});



phonebookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
module.exports = mongoose.model("Phonebook", phonebookSchema);
