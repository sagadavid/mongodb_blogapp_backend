const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const mongoose = require("mongoose");
const url = "mongodb://localhost/blog"; // URL of the MongoDB database
const User = require("./user");

mongoose.set("strictQuery", true);

app.use(bodyParser.json()); // Parse incoming requests
app.use(bodyParser.urlencoded({ extended: false }));

// Endpoint for user login
app.post("/api/user/login", async (req, res) => {
  try {
    // Open a connection to the MongoDB database
    await mongoose.connect(url);

    // Find the user in the database
    const user = await User.find({
      username: req.body.username,
      password: req.body.password,
    });

    if (user.length === 1) {
      return res.status(200).json({
        status: "success",
        data: user,
      });
    } else {
      return res.status(200).json({
        status: "fail",
        message: "Login Failed",
      });
    }
  } catch (error) {
    console.error("Error connecting to the database:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
});

app.listen(3000, () => console.log("Listening on port 3000"));
