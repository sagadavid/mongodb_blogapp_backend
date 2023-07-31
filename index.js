const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

const mongoose = require("mongoose");
const url = "mongodb://localhost/blog"; // URL of the MongoDB database

const User = require("./models/user");
const Post = require("./models/post");
//middleware
app.use(bodyParser.json()); // Parse incoming requests
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.set("strictQuery", true);

// Connect to MongoDB
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => console.error("Error connecting to MongoDB:", err.message));

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

// Route: Create Post
app.post("/api/post/createPost", async (req, res) => {
  try {
    const { title, text, author_id } = req.body;
    const post = new Post({
      title,
      text,
      author_id: new mongoose.Types.ObjectId(author_id), //Error creating a new post: TypeError: Class constructor ObjectId cannot be invoked without 'new'
    });
    const savedPost = await post.save();
    return res.status(200).json({
      status: "success",
      data: savedPost,
    });
  } catch (err) {
    console.error("Error creating a new post:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to create a new post",
    });
  }
});

app.listen(port, () => {
  console.log("Server started on port 3000");
});
