const express = require("express");
const app = express();
app.get("/api/user/login", (req, res) => {
  res.send("Heisann Verden via get/listen express.js");
});
app.listen(3000, () => console.log("lyder på porten 3000"));
