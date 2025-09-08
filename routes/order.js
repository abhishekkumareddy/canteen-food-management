const express=require("express");
const order = express.Router();
require("dotenv").config();
const User=require("../models/user");
const Cart=require("../models/cart");
const item = require("../models/item");
const orders = require("../models/order");

order.get("/:Id", async (req, res) => {
  try {
    const Id = req.params.Id;
     const user=await User.findById(Id);
     if(user.role == "user"){
    // find all orders for this user
    const orderItems = await orders
      .find({ userId:Id }) // filter by userId
      .populate("userId")      // if you want user details
      .populate("managerId")   // if you want manager details
      .populate("items.itemId"); // if you want item details

    if (!orderItems || orderItems.length === 0) {
      return res.status(404).send("No orders found for this user");
    }
    res.render("../views/cart/orders.ejs",{orderItems});
   }else{
      const orderItems = await orders
      .find({ managerId:Id }) // filter by userId
      .populate("userId")      // if you want user details
      .populate("managerId")   // if you want manager details
      .populate("items.itemId"); // if you want item details

    if (!orderItems || orderItems.length === 0) {
      return res.status(404).send("No orders found for this user");
    }
    res.render("../views/cart/orders.ejs",{orderItems});
   }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});




module.exports = order ;