const mongoose = require('mongoose');

const parkingEntrySchema = new mongoose.Schema({
    vehicleId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'vehicle'

    },
    entryTime: {
        type: Date,
        required: true,

    },
    exitTime:{
        type: Date

    },
    AmountPaid:{
        Type:Number,
        default:0
    },
},

    {timestamps:true

    }

)

module.exports = mongoose.model('parkingEntry', parkingEntrySchema);