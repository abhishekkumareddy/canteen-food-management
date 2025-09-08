const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(express.json());
const cookieparser=require("cookie-parser");
const passport=require("passport");
const session=require("express-session");
app.use(cookieparser());
const MongoStore=require("connect-mongo");
const LocalStrategy=require("passport-local");
const path=require("path");
// const user=require("../models/user");
app.set('view engine', 'ejs');
const router=require('./routes/auth');

// Set the path to the views directory
app.set('views', path.join(__dirname, 'views'));
connectDB();

const store=MongoStore.create({
    mongoUrl:process.env.MONGO_URI,
    crypto:{
        secret:process.env.JWT_SECRET,
    },
    touchAfter: 24 * 3600,
});

const sessionOptions={
    store,
    secret:process.env.JWT_SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true
    }
}

app.use(session(sessionOptions));
// app.use(flash());

app.use(passport.initialize());
 app.use(passport.session());
// passport.use(new LocalStrategy(user.authenticate()));

// passport.serializeUser(user.serializeUser());
// passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
    res.locals.curruser = req.session.user; 
    if(res.locals.curruser){
    // console.log(res.locals.curruser);
    }
     // passport attaches logged-in user to req.user
    next();
});




app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', router);
app.use('/api/item',require('./routes/items'));
app.use('/api/cart',require('./routes/cart'));
app.use('/api/order',require('./routes/order'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
