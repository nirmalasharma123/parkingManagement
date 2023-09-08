const mongoose = require('mongoose');

const rateSchema = new mongoose.Schema({
    parkingId:{
        type:mongoose.Schema.Types.ObjectId,
        require: true

    },
    vehicleType:{
        type:String,
        required:true,
        enum:['Two-Wheeler','Three-Wheeler','Four-Wheeler']

    },
    uptoTwoHour:{
      type:Number,
      required:true
    },
    twoToFour:{
      type:Number,
      required:true
    },
    moreThenFour:{
      type:Number,
      required:true
    }

})
module .exports = mongoose.model('rate',rateSchema);
