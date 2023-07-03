const mongoose = require("mongoose");
mongoose.set('strictQuery', false)
const DBConnect = () => {
  try {
    const conn = mongoose.connect(
      "mongodb+srv://vineet:vineet@cluster0.tvst1lb.mongodb.net/excel",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log("Database Connected Successfully");
  } catch (error) {
    console.log("Database error");
  }
};

module.exports = {
  DBConnect,
};
