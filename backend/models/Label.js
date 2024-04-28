const mongoose= require("mongoose");

const labelSchema= new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name:{
        type: String,
        required: true
    },
    notes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note"
    }]
});

module.exports= mongoose.model("Label",labelSchema);