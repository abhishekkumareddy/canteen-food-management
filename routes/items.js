const express=require("express");
require("../models/user");
const item=require("../models/item");
const { model } = require("mongoose");
const checking=require("../middlewares/checking");
const Item=express.Router();
Item.get("/",async (req,res)=>{
    const items = await item.find().populate("managerId");;
    res.render("../views/item/view.ejs",{item:items});
})
Item.get("/additems",(req,res)=>{
   res.render("../views/item/add.ejs");
});
Item.post("/additems",checking,async (req,res)=>{
    let {name,description,price}=req.body;
    console.log(req.user._id);
    let user = await item.create({
        name,
        description,
        price,
        managerId:req.user._id
    })
    user.save();
    res.redirect("/api/item/");
})

Item.get("/:id",async (req,res)=>{ 
    try {
        const id = req.params.id;
        const itemData = await item.findById(id);

        if (!itemData) {
            return res.status(404).send("Item not found");
        }

        res.render("item/detail.ejs", { items: itemData });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});
Item.get("/edit/:id",async (req,res)=>{
    let id=req.params.id;
    const itemData=await item.findById(id);
    res.render("../views/item/update.ejs",{itemData});
})

Item.post("/edit/:id",async (req,res)=>{
    const {name,description,price}=req.body;
    // let items=await item.findByIdAndUpdate(req.params.id,
    //     {
    //         name:newname,
    //     description:newDis,
    //     price:newPrice},
       
    //   { new: true }
    // );
    const updatedItem = await item.findByIdAndUpdate(
            req.params.id,
            {
                name:name,
                description: description,
                price: price
            },
            { new: true } // returns the updated document
        );
   // item.save();
    res.redirect("/api/item/");
});

Item.get("/delete/:id", async (req,res)=>{
    const itemdele= await item.findByIdAndDelete(req.params.id);
    res.redirect("/api/item/");
})
 module.exports=Item;
// const express = require("express");
// const item = require("../models/item");
// const checkRole = require("../middlewares/authMiddle"); // 👈 import
// const Item = express.Router();

// // Anyone can view items
// Item.get("/", async (req, res) => {
//     const items = await item.find();
//     res.render("../views/item/view.ejs", { item: items });
// });

// // Restrict add items — only admin
// Item.get("/additems", checkRole("admin"), (req, res) => {
//     res.render("../views/item/add.ejs");
// });

// Item.post("/additems", checkRole("admin"), async (req, res) => {
//     let { name, description, price } = req.body;
//     let newItem = await item.create({ name, description, price });
//     res.redirect("/api/item/");
// });

// // Restrict edit items — only admin
// Item.get("/edit/:id", checkRole("admin"), async (req, res) => {
//     let id = req.params.id;
//     const itemData = await item.findById(id);
//     res.render("../views/item/update.ejs", { itemData });
// });

// Item.post("/edit/:id", checkRole("admin"), async (req, res) => {
//     const { name, description, price } = req.body;
//     await item.findByIdAndUpdate(req.params.id, { name, description, price });
//     res.redirect("/api/item/");
// });

// // Restrict delete items — only admin
// Item.get("/delete/:id", checkRole("admin"), async (req, res) => {
//     await item.findByIdAndDelete(req.params.id);
//     res.redirect("/api/item/");
// });

// // Detail page — public
// Item.get("/:id", async (req, res) => {
//     try {
//         const id = req.params.id;
//         const itemData = await item.findById(id);
//         if (!itemData) return res.status(404).send("Item not found");
//         res.render("item/detail.ejs", { items: itemData });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Server error");
//     }
// });

// module.exports = Item;
