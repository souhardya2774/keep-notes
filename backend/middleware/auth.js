const mongoose= require("mongoose");

const auth= (req,res,next)=>{
    console.log("Auth middleware - req.user:", req.user);
    
    if(!req.user || !req.user._id){
        return res.status(401).json({ message: 'Unauthorized' });
    }else if(!mongoose.isValidObjectId(req.user._id)){
        return res.status(401).json({ message: 'Unauthorized' });
    }else{
        next();
    }
};

module.exports= auth;