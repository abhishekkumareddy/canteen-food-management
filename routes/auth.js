const express=require("express");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const User=require("../models/user");
require('dotenv').config();
const router = express.Router();
const sendOTP = require('../utils/mailer');
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
//logout



router.get("/logout", (req, res) => {
  res.clearCookie("token"); // remove the JWT token cookie
  return res.redirect("/api/auth/login"); // redirect to login page
});


//register
router.get("/",async(req,res)=>{
   const allUsers = await User.find();
  res.render("../views/auth/view.ejs",{User:allUsers});
});

router.get('/register',async(req,res)=>{
     res.render("../views/auth/register.ejs");
});

router.post('/register', async (req,res)=>{
    const {name,email,role,password} = req.body;
    try {
        const userExists = await User.findOne({email});
        if(userExists) {
            return res.status(400).json({msg:'User already exists'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        const user = await User.create({
            name,
            email,
            role,
            password: hashedPassword,
            otp,
            otpExpires: otpExpiry
        });

        await sendOTP(email, otp);
        res.render("../views/auth/verify.ejs",{user});
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).send('server error');
    }
});

// Login

router.get("/login",(req,res)=>{
  res.render("../views/auth/login.ejs");
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'});
    
    req.session.user=user;
    req.session.jwt=token;
        res.cookie('token',token,{
        httpOnly: true,
        secure: false, // Set true in production with HTTPS
       sameSite: 'Strict',
       maxAge: 24 * 60 * 60 * 1000, 
         });
    //res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    res.redirect("/api/auth/");

  } catch (err) {
    res.status(500).send('Server error');
  }
});
// router.put("/:_id/:priority",async (req,res)=>{

//   let {id,newPriority}=req.params;
//   try{
//     let updated= await User.findByIdAndUpdate(id,{priority:newPriority},{new:true});
//     if(!updated){
//       return res.status(400).json({msg:"notfound"});
//     }else{
//       res.json(updated);
//     }
//   }catch(err){
//       return res.status(500).json({msg:" id not found"});
//   }
// });
router.get("/:_id",async (req,res)=>{
  //let userid=req.params;
  
  let user = await User.findById(req.params._id);``
  res.render("../views/auth/update.ejs",{user});
})
router.post("/edit/:_id", async (req, res) => {
 // const {  priority } = req.body; // extract from URL
   const token = req.cookies.token;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decodeURI) res.redirect("/api/auth/login");
    // const updated = await User.findByIdAndUpdate(
    //   req.params._id,
    //   { priority: priority },
    //   { new: true }
    // );
    
    if (!updated) {
      return res.status(400).json({ msg: "User not found" });
    }
            res.redirect("/api/auth/");

    
  } catch (err) {
   res.redirect("/api/auth/login");
  }
});



router.post('/verify-otp', async (req, res) => {
  const { userId, otp } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (user.isVerified) return res.status(400).json({ msg: 'Already verified' });

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    //res.json({ msg: 'Email verified successfully' });
    res.redirect("/api/auth/login");
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});





module.exports = router;