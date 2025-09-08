const jwt = require("jsonwebtoken");
const User = require("../models/user"); // import your User/Manager model

const authMiddleware = async (req, res, next) => {
    try {
        req.user =req.session.user; // store full user object in req
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = authMiddleware;
