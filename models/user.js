const mongoose = require('mongoose');
//const passportlocalmongoose=require("passport-local-mongoose");
const userSchema = new mongoose.Schema({
    name:String,
    email:{type:String,unique:true},
    role: {
        type: String,
    },
    password:String,
    otp:String,
    otpExpires: Date,
  isVerified: { type: Boolean, default: false }
});

// userSchema.plugin(passportlocalmongoose);
module.exports = mongoose.model('user',userSchema);