var express = require("express");
var router = express.Router();
require("dotenv").config();
const mongodb = require("mongodb");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");


router.post("/", async (req, res, next) => {
    console.log(req.body)
  var user = req.body;
  try {
    const client = await mongodb.connect(process.env.DBURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = client.db("pizza");
    var data = await db.collection("users").findOne({ email: user.email });
    if (data === null) {
      res.status(404).json({ message: "User does not exists" });
    } else {
      const result = await bcrypt.compare(user.password, data.password);
      if (result) {
        delete data.password;
        let jwtToken = jwt.sign({ user: data }, process.env.JWTTK, {
          expiresIn: "1h",
        });
        res
          .status(200)
          .json({ message: "success", user: data, jwtToken: jwtToken });
      } else {
        res.status(401).json({ message: "Password not matching" });
      }
    }
    await client.close();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "failed" });
  }
});

module.exports = router;
