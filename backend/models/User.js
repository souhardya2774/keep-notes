const mongoose= require("mongoose");

const userSchema= new mongoose.Schema({
    profileId:{
        type: String,
        required: true,
        unique: true
    },
    displayName:{
        type: String,
        default: ""
    },
    labels:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Label"
    }],
    notes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note"
    }]
},{
    timestamps: true
});

module.exports= mongoose.model("User",userSchema);