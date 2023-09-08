const mongoose = require('mongoose');

const parkingEntrySchema = new mongoose.Schema({
    vehicleId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'vehicle'

    },
    parkingId:{
        type : mongoose.Schema.Types.ObjectId,
        ref:'Parking'

    },
    entryTime: {
        type: String,
        required: true,

    },
    exitTime:{
        type: String,
        default:""

    },
    amountPaid:{
        Type:Number,
    },
},
    {timestamps:true

    }

)

module.exports = mongoose.model('parkingEntry', parkingEntrySchema);