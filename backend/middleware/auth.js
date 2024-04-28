const mongoose= require("mongoose");

const auth= (err,req,res,next)=>{
    if(!req.user){
        return res.status(401).json({ message: 'Unauthorized' });
    }else if(!mongoose.isValidObjectId(req.user.id)){
        return res.status(401).json({ message: 'Unauthorized' });
    }else{
        next();
    }
};

module.exports= auth;