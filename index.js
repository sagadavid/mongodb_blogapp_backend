const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const mongoose = require("mongoose");
const url = "mongodb://localhost/blog"; // URL of the MongoDB database

const User = require("./models/user");
const Post = require("./models/post");

app.use(bodyParser.json()); // Parse incoming requests
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.set("strictQuery", true);

app.post("/api/user/login", async (req, res) => {
  try {
    // Open a connection to the MongoDB database
    await mongoose.connect(url);

    // Find the user in the database
    const loggedUser = await User.find({
      username: req.body.username,
      password: req.body.password,
    });

    if (loggedUser.length === 1) {
      return res.status(200).json({
        status: "success",
        data: loggedUser,
      });
    } else {
      return res.status(500).json({
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

app.post("/api/post/getAllPosts", async (req, res) => {
  try {
    await mongoose.connect(url);
    const allPosts = await Post.find().sort({ _id: -1 });
    res.status(200).json({
      status: "success",
      data: allPosts,
    });
  } catch (err) {
    console.error("Error retrieving posts:", err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while retrieving posts",
    });
  }
});

app.post("/api/post/getPostsByAuthor", async (req, res) => {
  try {
    await mongoose.connect(url);
    const authorsPosts = await Post.find(
      { author_id: req.body.author_id },
      [],
      { sort: { _id: -1 } }
    );
    res.status(200).json({
      status: "success",
      data: authorsPosts,
    });
  } catch (err) {
    console.error("Error retrieving authors posts:", err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while retrieving authors posts",
    });
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
