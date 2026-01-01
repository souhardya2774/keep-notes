const User= require("../models/User");
const passport= require("passport");
const asyncHandler= require("express-async-handler");
const isValidObjectId= require("mongoose").isValidObjectId;
const ObjectId= require("mongoose").Types.ObjectId;

// @Failed in login
const loginFailed=(req,res)=>{
    console.log("Failed");
    res.status(401).json({
        success: false,
        message: "Login failed"
    });
};

// @Check User is logged in or not
const checkLogin= asyncHandler(async(req,res)=>{
    console.log("Check login - req.user:", req.user);
    
    if(!req.user){
        return res.status(401).json({
            auth: false
        });
    }
    
    // req.user is now the full user object from deserialization
    const user = req.user;
    console.log("User found:", user);

    if(!user._id){
        return res.status(401).json({
            auth: false
        });
    }
    
    // Return user's labels
    res.status(200).json(user.labels || []);
});

// @Logout User
const logout= (req,res)=>{
    req.logout();
    res.redirect("http://localhost:5173");
};

module.exports= {
    loginFailed,
    checkLogin,
    logout
};