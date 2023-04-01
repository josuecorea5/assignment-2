const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGODB_CNN, {
      useNewUrlParser: true,
    });
    console.log("Database Connected!!!");
  } catch (error) {
    console.log(error);
    throw new Error("Error trying to initialize the Database");
  }
};

module.exports = {
  dbConnection,
};
