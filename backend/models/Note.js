const mongoose= require("mongoose");

const noteSchema= new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    labels:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Label"
    }],
    title:{
        type: String,
        default: ""
    },
    body:{
        type: String,
        default: ""
    },
    status:{
        type: String,
        enum: ["archived","pinned","none"],
        default: "none"
    }
},{
    timestamps: true
});

module.exports= mongoose.model("Note",noteSchema);