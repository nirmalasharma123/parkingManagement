const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    userId: { type:mongoose.Schema.Types.ObjectId,
    ref:"userModel"},
    type:{
        type:String,
        required:true,
        enum:[' Two-Wheeler','three-Wheeler','Four-Wheeler','SUV']
    },
    vehicleNumber:{
        type:String,
        unique:true,
        required:true
    }},

    {timestamps:true
})
module.exports = mongoose.model("vehicle",vehicleSchema);