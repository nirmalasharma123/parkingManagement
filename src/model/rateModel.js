const mongoose = require('mongoose');

const rateSchema = new mongoose.Schema({
    parkingId:{
        type:mongoose.Schema.Types.ObjectId,
        require: true

    },
    vehicleType:{
        type:String,
        required:true,
        enum:[' Two-Wheeler','three-Wheeler','Four-Wheeler','SUV']

    },
    rates:[
        {
            hoursRange:{type:String,required:true},
            rate:{type:Number}
        }
    ]

})
module .exports = mongoose.model('rate',rateSchema);