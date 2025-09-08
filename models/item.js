const mongoose = require("mongoose");
require("./user");
const itemSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    managerId: {
        type: mongoose.Schema.Types.ObjectId,  // Store MongoDB ObjectId
        ref: 'user',                        // Name of the model you are referencing
        required: true                         // Optional: make it mandatory
    }
});

module.exports = mongoose.model('Item', itemSchema);
