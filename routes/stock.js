var express = require("express");
var router = express.Router();
require("dotenv").config();
const mongodb = require("mongodb");

router.get("/", async (req, res) => {
  const client = await mongodb.connect(process.env.DBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db("pizza");
  try {
    const data = await db.collection("stock").find().toArray();
    res.status(200).json(data);
    await client.close();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "failed" });
    await client.close();
  }
});

module.exports = router;