// const mongoose=require("mongoose");

// const cartSchema= new mongoose.Schema({
//     name:String,
//     description:String,
//     price:Number,

// });

// module.exports=mongoose.model('cart',cartSchema);
// models/Cart.js
const mongoose = require("mongoose");
require("../models/item");
require("../models/user");

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "ser", required: true },
  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
      quantity: { type: Number, default: 1 }
    }
  ]
});

module.exports= mongoose.model("cart", CartSchema);

