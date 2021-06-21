var express = require("express");
var router = express.Router();
require("dotenv").config();
const mongodb = require("mongodb");

router.post("/", async (req, res) => {
  var order = req.body;
  order.orderedAt = new Date();
  console.log(order);
  const client = await mongodb.connect(process.env.DBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db("pizza");
  try {
    const data = await db
      .collection("kitchen")
      .insert({
        email: order.email,
        orderDetails: order.orderDetails,
        orderedAt : order.orderedAt,
        status: "recieved",
        order_id : order.order_id,
        amount : order.amount
      });
    const data1 = await db.collection("users").update(
      { email: order.email },
      {
        $push: {
          myOrders: {orderDetails :  order.orderDetails , orderedAt : order.orderedAt , order_id : order.order_id, amount : order.amount , status: "recieved" },
        },
      }
    );

    res.status(200).json({ order_id: data._id });
    await client.close();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "failed" });
    await client.close();
  }
});

router.put("/", async (req, res) => {
  var order = req.body;
  console.log(order);
  const client = await mongodb.connect(process.env.DBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db("pizza");
  try {
    const data = await db.collection("kitchen").updateOne(
     { order_id : order.id },
       { $set : { status : order.status } }
    );
    console.log(order.email)
    const data1 = await db.collection("users").updateOne(
      { email : order.email , "myOrders.order_id" : order.id },
      {$set : {"myOrders.$.status" : order.status } }
     );
    

    res.status(200).json({ order_id: data._id });
    await client.close();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "failed" });
    await client.close();
  }
});

router.get("/", async (req, res) => {
  const client = await mongodb.connect(process.env.DBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db("pizza");
  try {
    const data = await db.collection("kitchen").find().toArray();
    res.status(200).json(data);
    await client.close();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "failed" });
    await client.close();
  }
});

router.post("/tracking", async (req, res) => {
  var track = req.body;
  console.log(track)
  const client = await mongodb.connect(process.env.DBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db("pizza");
  try {
    const data = await db
      .collection("kitchen")
      .find({ email: track.email })
      .toArray();
      console.log(data)
    res.status(200).json(data);
    await client.close();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "failed" });
    await client.close();
  }
});

module.exports = router;
