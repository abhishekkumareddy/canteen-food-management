const express = require("express");
const cart = express.Router();
require("dotenv").config();
const User=require("../models/user");
const Cart=require("../models/cart");
const item = require("../models/item");
const Order = require("../models/order");
// Get cart items of a specific user
// POST /api/cart/add
// GET /api/cart/:userId
cart.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
   
    const cart = await Cart.findOne({ userId })
      .populate("items.itemId") // get item details
      .exec();

    if (!cart) {
      console.log("No cart found for this user");
      return res.render("../views/cart/cart.ejs", { cart: null });
    }

    cart.items.forEach((cartItem, index) => {
      if (cartItem.itemId) {
      //  console.log(`Item ${index + 1}: ${cartItem.itemId.name}`);
      } else {
        //console.log(`Item ${index + 1}: [Item not found or not populated]`);
      }
    });

    res.render("../views/cart/cart.ejs", { cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// cart.get("/add/:id",(req,res)=>{
//     res.redirect("/api/item");
// })
cart.get("/add/:id", async (req, res) => {
  try {
    const userId = req.session.user._id;
    const itemId = req.params.id;
    const items = item.findById(itemId);
    const quantity=1;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      // create a new cart for user
      cart = new Cart({
        userId,
        items: [{ itemId ,quantity}]
      });
    } else {
      // check if item already exists in cart
      const itemIndex = cart.items.findIndex(i => i.itemId == itemId);
    //  console.log(itemIndex);
      if (itemIndex > -1) {
        // item exists, update quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // item doesn’t exist, push new
        cart.items.push({ itemId});
      }
    }

    await cart.save();
   // res.json(cart);
     res.redirect("/api/item");

  } catch (err) {
    res.status(500).json({ message: "it is the error" });
  }
});


// cart.get("/order/:id", async (req, res) => {
//   try {
//     let carts = await Cart.findById(req.params.id);
//     let user = await User.findById(carts.userId);
   
//     // store all itemIds in an array
//     let itemsId = [];
//     for (let it of carts.items) {
//       console.log(it);
//       itemsId.push(it.itemId.toString()); // ensure it's stored as string
//     }
//     res.send(itemsId); // send array of strings
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

cart.get("/order/:id", async (req, res) => {
  try {
    let cartData = await Cart.findById(req.params.id);
    if (!cartData) {
      return res.status(404).json({ message: "Cart not found" });
    }

    let user = await User.findById(cartData.userId);
    // console.log("hi")
    // const prefix = "ORD";
    // const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
    // let orderId= `${prefix}-${randomPart}`;

    // Get all items with their details
    let items = await Promise.all(
      cartData.items.map(async (it) => {
        let itemitem = await item.findById(it.itemId);
        return {
          name: itemitem.name,
          price: itemitem.price,
          quantity: it.quantity,
          total: itemitem.price * it.quantity,
        };
      })
    );

    // Calculate total bill
    let totalBill = items.reduce((acc, item) => acc + item.total, 0);

    res.render("../views/cart/addcart",{items,totalBill,user,cartData});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
 


cart.get("/place-order/:cartId", async (req, res) => {
  try {
    let cartData = await Cart.findById(req.params.cartId);
    if (!cartData) return res.status(404).json({ message: "Cart not found" });

    let user = await User.findById(cartData.userId);

    // Fetch all items
    let items = await Promise.all(
      cartData.items.map(async (it) => {
        let itemitem = await item.findById(it.itemId).populate("managerId");
        return {
          itemId: itemitem._id,
          quantity: it.quantity,
          price: itemitem.price,
          total: itemitem.price * it.quantity,
          managerId: itemitem.managerId._id
        };
      })
    );

    // Calculate totals
    let subtotal = items.reduce((acc, i) => acc + i.total, 0);
    let tax = subtotal * 0.1;
    let grandTotal = subtotal + tax;

    // Take manager from first item (or enhance for multiple)
    let managerId = items[0].managerId;
    const prefix = "ORD";
     const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
     let orderId= `${prefix}-${randomPart}`
    // Save order
    const newOrder = new Order({
      orderId:orderId,
      userId: user._id,
      managerId: managerId,
      items,
      subtotal,
      tax,
      grandTotal
    });

    await newOrder.save();

    // Populate manager details for invoice
    let manager = await User.findById(managerId);

    res.render("../views/cart/invoice", {
      user,
      manager,
      order: newOrder
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = cart;
