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

mongoose
  .connect(url, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });

//// Endpoint for user login
// app.post('/api/user/login', (req, res) => {
//   mongoose.connect(url, { },
// function(err) {
//       if (err) throw err;
//       User.find({
//           username: req.body.username,
//           password: req.body.password
//       }, function(err, user) {
//           if (err) throw err;
//           if (user.length === 1) {
//               return res.status(200).json({
//                   status: 'success',
//                   data: user
//               })
//           } else {
//               return res.status(200).json({
//                   status: 'fail',
//                   message: 'Login Failed'
//               })
//           }

//       })
//   });
// });
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

////endpoint get all posts
// app.post("/api/post/getAllPost", (req, res) => {
//   mongoose.connect(url, {}, function (err) {
//     if (err) throw err;
//     Post.find({}, [], { sort: { _id: -1 } }, (err, Doc) => {
//       if (err) throw err;
//       return res.status(200).json({
//         status: "success",
//         data: Doc,
//       });
//     });
//   });
// });
// app.listen(3000, () => console.log("Listening on port 3000"));

app.post("/api/post/getAllPost", async (req, res) => {
  try {
    const posts = await Post.find().sort({ _id: -1 });
    res.status(200).json({
      status: "success",
      data: posts,
    });
  } catch (err) {
    console.error("Error retrieving posts:", err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while retrieving posts",
    });
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
