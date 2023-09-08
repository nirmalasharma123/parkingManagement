const mongoose = require('mongoose');

    const capacitySchema = new mongoose.Schema({
        parkingId :{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Parking',
        },
        vehicleType:{
            type:String,
            required:true,
            enum:[' Two-Wheeler','three-Wheeler','Four-Wheeler','SUV']
        },
        totalCapacity:{
            type:Number,
            required:true
        },  
        availableCapacity:{
            type:Number,
            default:0

        }
    },

        {timestamps:true

    })
    module.exports = mongoose.model('Capacity',capacitySchema);