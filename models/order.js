const mongoose=require("mongoose")
const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, // assuming manager is also a user
  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
      quantity: Number,
      price: Number,
      total: Number
    }
  ],
  subtotal: Number,
  tax: Number,
  grandTotal: Number,
  createdAt: { type: Date, default: Date.now }
});


module.exports= mongoose.model("Order", orderSchema);
