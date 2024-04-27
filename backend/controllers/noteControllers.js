const asyncHandler= require("express-async-handler");
const ObjectId= require("mongoose").Types.ObjectId;
const User= require("../models/User");
const Note= require("../models/Note");
const Label= require("../models/Label");
const { isValidObjectId } = require("mongoose");

const getAllNotes= asyncHandler(async(req,res)=>{
    const Id= req.user;
    const user= await User.findById(new ObjectId(Id),"notes").lean().populate({path: "notes", match: {$or:[{status: "none"},{status:"pinned"}]},select: "-userId",populate:{path: "labels",select: "-userId -notes"}}).lean().exec();
    if(!user){
        return res.status(401).json({message: 'Unauthorized'});
    }
    // console.log(user.notes[4].labels);
    res.json(user.notes);
});

const createNewNote= asyncHandler(async(req,res)=>{
    const Id= req.user;
    const user= await User.findById(new ObjectId(Id),"labels").lean().populate("labels","-notes -userId").exec();
    if(!user){
        return res.status(401).json({message: 'Unauthorized'});
    }
    console.log(user);
    const {title,body,selected}= req.body;
    if(!Array.isArray(selected)){
        return res.status(200).json({
            success: false,
            message: "Selected labels are not correct !"
        });
    }

    console.log(selected);

    const realLabels=[];
    const labels= [];

    for(let i=0;i<selected.length;i+=1){
        let test= true;
        for(let j=i-1;j>=0;j-=1){
            if(selected[i]===selected[j]){
                test= false;
            }
        }
        if(test){
            for(let j=0;j<user.labels.length;j+=1){
                if(user.labels[j].name===selected[i]){
                    labels.push({
                        _id: user.labels[j]._id,
                        name: selected[i]
                    });
                    realLabels.push(user.labels[j]._id);
                }
            }
        }
    }

    console.log("Note creation -> ",realLabels);
    const newNote= await Note.create({
        userId: new ObjectId(Id),
        labels: realLabels,
        title: title,
        body: body
    });

    if(!newNote){
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }

    console.log(newNote);

    const userN=await User.findByIdAndUpdate(user._id,{
        $push:{
            notes: newNote
        }
    }).select("-notes").lean().exec();

    if(!userN){
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }

    for(let i=0;i<realLabels.length;i+=1){
        console.log("--->",realLabels[i]);
        const labelN= await Label.findByIdAndUpdate(realLabels[i],{
            $push:{
                notes: newNote
            }
        }).select("-notes").lean().exec();
        
        if(!labelN){
            return res.status(500).json({
                message: "Internal Server Error"
            });
        }
    }

    res.status(200).json({
        success: true,
        newOne:{
            _id: newNote._id,
            title: title,
            status: "none",
            body: body,
            labels: labels
        }
    });
});

const updateNote= asyncHandler(async(req,res)=>{
    const Id= req.user;
    const noteId= req.params.id;
    if(!noteId || !isValidObjectId(noteId)){
        return res.status(404).json({
            message: "No such note exists"
        });
    }
    const user= await User.findById(new ObjectId(Id)).populate([{path: "notes", match: {_id: new ObjectId(noteId)},select: "-userId",populate:{
        path: "labels",
        select: "-notes -userId"
    }},{path:"labels",select:"-notes -userId"}]).lean().exec();

    console.log(user);

    if(!user){
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }

    if(!(user.notes.length)){
        return res.status(404).json({
            message: "No such note exists"
        });
    }

    let {title,body,selected}= req.body;

    if(!title){
        title= user.notes[0].title;
    }
    if(!body){
        body= user.notes[0].body;
    }
    if(!selected){
        selected= (user.notes[0].labels).map(select=>select.name);
    }

    if(!Array.isArray(selected)){
        return res.status(200).json({
            success: false,
            message: "Selected labels are not correct !"
        });
    }

    const realLabels=[];
    const labels= [];

    for(let i=0;i<selected.length;i+=1){
        let test= true;
        for(let j=i-1;j>=0;j-=1){
            if(selected[i]===selected[j]){
                test= false;
            }
        }
        if(test){
            for(let j=0;j<user.labels.length;j+=1){
                if(user.labels[j].name===selected[i]){
                    labels.push({
                        _id: user.labels[j]._id,
                        name: selected[i]
                    });
                    realLabels.push(user.labels[j]._id);
                }
            }
        }
    }

    const updatedNote= await Note.findByIdAndUpdate(new ObjectId(noteId),{
        title: title,
        body: body,
        labels: realLabels
    }).select("-userId").populate("labels","-notes -userId").lean().exec();

    console.log(updatedNote);

    if(!updatedNote){
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }

    const alredy= user.notes[0].labels;

    for(let i=0;i<alredy.length;i+=1){
        for(let j=0;j<realLabels.length;j+=1){
            if(alredy[i]._id==realLabels[j]){
                alredy[i]=realLabels[j]=null;
            }
        }
        if(alredy[i]){
            const labelN= await Label.findByIdAndUpdate(new ObjectId(alredy[i]._id),{
                $pull:{
                    notes: noteId
                }
            }).select("-notes").lean().exec();
            if(!labelN){
                return res.status(500).json({
                    message: "Internal Server Error"
                });
            }
        }
    }

    for(let i=0;i<realLabels.length;i+=1){
        if(!realLabels[i]){
            continue;
        }

        const labelN= await Label.findByIdAndUpdate(new ObjectId(realLabels[i]),{
            $push:{
                notes: noteId
            }
        }).select("-notes").lean().exec();
        if(!labelN){
            return res.status(500).json({
                message: "Internal Server Error"
            });
        }
    }

    res.status(200).json({
        success: true,
        updateNote:{
            _id: updatedNote._id,
            title: title,
            status: updatedNote.status,
            body: body,
            labels: labels
        }
    });
});

const deleteNote= asyncHandler(async(req,res)=>{
    const userId= req.user;
    const noteId= req.params.id;
    if(!noteId || !isValidObjectId(noteId)){
        return res.status(404).json({
            message: "No such note exists"
        });
    }
    const user= await User.findById(new ObjectId(userId),"notes").lean().populate({path: "notes", match: {_id:new ObjectId(noteId)},select: "-userId"}).lean().exec();
    console.log(user);
    if(!user){
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
    if(!(user.notes.length)){
        return res.status(404).json({
            message: "No such note exists"
        });
    }

    console.log(user.notes[0]);
    const alredy= user.notes[0].labels;
    for(let i=0;i<alredy.length;i+=1){
        const noteN= await Label.findByIdAndUpdate(new ObjectId(alredy[i]),{
            $pull:{
                notes: new ObjectId(noteId)
            }
        }).select("name").lean().exec();
        if(!noteN){
            return res.status(500).json({
                message: "Internal Server Error"
            });
        }
    }

    const userN= await User.findByIdAndUpdate(new ObjectId(userId),{
        $pull:{
            notes: new ObjectId(noteId)
        }
    }).select("_id").lean().exec();
    if(!userN){
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }

    const noteN= await Note.findByIdAndDelete(new ObjectId(noteId)).select("userId").lean().exec();
    if(!noteN){
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }

    res.status(200).json({
        status: true,
        message: "Note has been deleted"
    });
});

const getAllArchivedNotes= asyncHandler(async(req,res)=>{
    const Id= req.user;
    const user= await User.findById(new ObjectId(Id),"notes").lean().populate({path: "notes", match: {status: "archived"},select: "-userId",populate:{path: "labels",select: "-userId -notes"}}).lean().exec();
    if(!user){
        return res.status(401).json({message: 'Unauthorized'});
    }
    
    res.json(user.notes);
});

const changeStatusNotes= asyncHandler(async(req,res)=>{
    const userId= req.user;
    const {noteId}= req.body;
    if(!noteId || !isValidObjectId(noteId)){
        return res.status(404).json({
            message: "No such note exists"
        });
    }
    const user= await User.findById(new ObjectId(userId)).populate({path: "notes", match: {_id: new ObjectId(noteId)},select: "_id status"}).lean().exec();

    if(!user){
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }

    if(!(user.notes.length)){
        return res.status(404).json({
            message: "No such note exists"
        });
    }

    const previousStatus= user.notes[0].status;

    const noteN= await Note.findByIdAndUpdate(new ObjectId(noteId),{
        status: (previousStatus==="archived")?"none":"archived"
    }).select("_id").lean().exec();

    if(!noteN){
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }

    res.status(200).json({
        success: true,
        message: "Note status changed!"
    });
});

module.exports={
    getAllNotes,
    createNewNote,
    updateNote,
    getAllArchivedNotes,
    deleteNote,
    changeStatusNotes
};