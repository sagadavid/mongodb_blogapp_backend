const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const mongoose = require("mongoose");
const url = "mongodb://localhost/blog"; //url of data at mongoDB
const User = require("./user");

mongoose.set("strictQuery", true);

app.use(bodyParser.json()); //parse coming request
app.use(bodyParser.urlencoded({ extended: false }));

//at the end, send matched/found user to login component via url
app.post("/api/user/login", (req, res) => {
  //open monoose default connection to mongoDB
  mongoose.connect(url, {}, function (err) {
    if (err) throw err;
    //pars and match monoose user in the request and respond
    User.find(
      {
        username: req.body.username,
        password: req.body.password,
      },
      function (err, user) {
        if (err) throw err;
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
      }
    );
  });
});
app.listen(3000, () => console.log("hører på porten 3000"));
