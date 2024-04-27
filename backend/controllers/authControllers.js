const User= require("../models/User");
const passport= require("passport");
const asyncHandler= require("express-async-handler");
const isValidObjectId= require("mongoose").isValidObjectId;
const ObjectId= require("mongoose").Types.ObjectId;

// @Failed in login
const loginFailed=(req,res)=>{
    // console.log("Failed");
    res.status(401).json({
        success: false,
        message: "Login failed"
    });
};

// @Check User is logged in or not
const checkLogin= asyncHandler(async(req,res)=>{
    // console.log(req);
    // console.log("Here",req.user);
    if(!(req.user) || !(isValidObjectId(req.user))){
        return res.status(401).json({
            auth: false
        });
    }
    const Id= req.user;

    const user=await User.findById(new ObjectId(Id)).select("-profileId -notes").lean().populate("labels","-notes -userId").exec();
    console.log(user);

    if(!user){
        return res.status(401).json({
            auth: false
        });
    }
    res.status(200).json(user.labels);
});

// @Logout User
const logout= (req,res)=>{
    req.logout();
    res.redirect("https://keep-notes-client.vercel.app");
};

module.exports= {
    loginFailed,
    checkLogin,
    logout
};