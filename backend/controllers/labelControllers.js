const asyncHandler= require("express-async-handler");
const ObjectId= require("mongoose").Types.ObjectId;
const isValidObjectId= require("mongoose").isValidObjectId;
const User= require("../models/User");
const Note= require("../models/Note");
const Label= require("../models/Label");

const getAllLabels= asyncHandler(async (req,res)=>{
    const Id= req.user;
    const user= await User.findById(new ObjectId(Id),"labels").lean().populate({path: "labels",select: "-userId -notes"}).exec();
    if(!user){
        return res.status(401).json({message: 'Unauthorized'});
    }
    console.log(user);
    res.json(user.labels);
});

const createNewLabel= asyncHandler(async (req,res)=>{
    const {raw_label}= req.body;
    console.log(raw_label);
    const label= (raw_label)?raw_label.trim():raw_label;
    console.log(label);
    if(!(label) || !(label.length)){
        return res.status(200).json({
            success: false
            ,message: "Can't be blank!"
        });
    }
    const Id= req.user;
    const user= await User.findById(new ObjectId(Id),"labels").lean().populate({path: "labels", match: {name: label},select: "-userId -notes"}).exec();
    console.log(user);
    if(!user){
        return res.status(401).json({message: 'Unauthorized'});
    }
    if(user.labels.length){
        return res.status(200).json({
            success: false
            ,message: "Label with same name already exists!"
        });
    }
    const labelCreated= await Label.create({
        "userId": user._id,
        "name": label
    });
    console.log(labelCreated);
    console.log(user.labels);

    const userN=await User.findByIdAndUpdate(user._id,{
        $push:{
            labels: labelCreated
        }
    }).select("-notes").lean();

    console.log(userN);

    res.status(200).json({
        success: true,
        label:{
            _id: labelCreated._id,
            name: labelCreated.name
        }
    });
});

const getAllNotes= asyncHandler(async(req,res)=>{
    const Id= req.user;
    const labelId= req.params.id;
    if(!labelId || !isValidObjectId(labelId)){
        return res.status(404).json({message:"404, Not found!"});
    }
    const label= await Label.findOne({userId: new ObjectId(Id), _id: new ObjectId(labelId)}).lean().populate({path:"notes",select:"-userId",populate:{path: "labels",select: "-userId -notes"}}).exec();
    if(!label){
        return res.status(404).json({message:"404, Not found!"});
    }
    console.log(label);
    res.status(200).json(label.notes);
});

const deleteLabel= asyncHandler(async(req,res)=>{
    const Id= req.user;
    const labelId= req.params.id;
    if(!labelId || !isValidObjectId(labelId)){
        return res.status(404).json({message:"404, Not found!"});
    }
    const label= await Label.findOneAndDelete({_id: new ObjectId(labelId), userId: new ObjectId(Id)}).select("name notes").lean().exec();

    if(!label){
        return res.status(404).json({message:"404, Not found!"});
    }

    for(let i=0;i<label.notes.length;i+=1){
        const noteN= await Note.findByIdAndUpdate(new ObjectId(label.notes[i]),{
            $pull:{
                labels: new ObjectId(labelId)
            }
        }).select("-labels").lean().exec();

        if(!noteN){
            return res.status(500).json({
                message: "Internal Server Error"
            });
        }
    }

    const userN=await User.findByIdAndUpdate(new ObjectId(Id),{
        $pull:{
            labels: new ObjectId(labelId)
        }
    }).select("-notes -labels").lean().exec();

    if(!userN){
        return res.status(500).json({
            message: "Internal Server Error"
        });
    } 

    res.status(200).json({
        success: true,
        message: `${label.name} got deleted!`
    });
});

const updateLabelName= asyncHandler(async(req,res)=>{
    const Id= req.user;
    const labelId= req.params.id;
    if(!labelId || !isValidObjectId(labelId)){
        return res.status(404).json({message:"404, Not found!"});
    }

    const {labelName}= req.body;
    if(!(labelName) || !((labelName.trim()).length)){
        return res.status(200).json({
            success: false
            ,message: "Can't be blank!"
        });
    }
    const user= await User.findById(new ObjectId(Id),"labels").lean().populate({path: "labels", match: {name: labelName},select: "-userId -notes"}).exec();

    if(!user){
        return res.status(401).json({message: 'Unauthenticated'});
    }
    if(user.labels.length){
        return res.status(200).json({
            success: false
            ,message: "Label with same name already exists!"
        });
    }

    const label= await Label.findOneAndUpdate({
        _id: new ObjectId(labelId),
        userId: new ObjectId(Id)
    },{
        name: labelName
    }).select("name").lean().exec();

    if(!label){
        return res.status(404).json({message:"404, Not found!"});
    }

    res.status(200).json({
        success: true,
        message: "Label name got updated!"
    });
});

module.exports={
    getAllLabels,
    createNewLabel,
    getAllNotes,
    deleteLabel,
    updateLabelName
};