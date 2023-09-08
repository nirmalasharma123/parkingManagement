const mongoose = require('mongoose');

const parkingEntrySchema = new mongoose.Schema({
    vehicleId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'vehicle'

    },
    entryTime: {

    },
    exitTime:{

    },
    duration:{
        type:Number,
        default:0
    },
    AmountPaid:{
        Type:Number,
        default:0
    },
},

    {timestamps:true

    }

)