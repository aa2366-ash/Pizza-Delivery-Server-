var express = require("express");
var router = express.Router();
require("dotenv").config();
const mongodb = require("mongodb");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

router.post('/', async (req,res)=>{
    
    var user = req.body;
    console.log(user)
    user.isEmailVerified = false;
    user.myOrders = [];
    const client = await mongodb.connect(process.env.DBURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    const db = client.db("pizza");
    try {
        const data = await db.collection("users").findOne({email : user.email },{name : 1})
        if(data !== null) {
            res.status(404).json({ message: "User already exists" });
            await client.close();
        }
        else {
            console.log(user.password)
            var hash =  bcrypt.hashSync(user.password, 10);
            user.password = hash;
            user.createdAt = new Date();
            const data = await db.collection("users").insertOne(user);
            res.status(200).json({ message: "success" });
            await client.close();
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "failed" });
        await client.close();
    }
    
})
  
  module.exports = router;