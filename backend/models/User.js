const mongoose= require("mongoose");

const userSchema= new mongoose.Schema({
    profileId:{
        type: String,
        required: true,
        unique: true
    },
    labels:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Label"
    }],
    notes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note"
    }]
});

module.exports= mongoose.model("User",userSchema);