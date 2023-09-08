const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    userId: { type:mongoose.Schema.Types.ObjectId,
    ref:"userModel"},
    type:{
        type:String,
        required:true
    },
    vehicleNumber:{
        type:String,
        required:true
    }},

    {timestamps:true
})
module.exports = mongoose.model("vehicle",vehicleSchema);