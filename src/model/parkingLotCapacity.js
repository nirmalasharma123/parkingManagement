const mongoose = require('mongoose');

    const capacitySchema = new mongoose.Schema({
        parkingId:{
            type:mongoose.Schema.Types.ObjectId,
            required: true
          },
          totalCapacityFourWheeler:{
            type:Number,
            required:true
          },
          totalCapacityThreeWheeler:{
            type:Number,
            required:true
          },
          totalCapacityTwoWheeler:{
            type:Number,
            required:true
          },
          availableFourWheeler:{
            type:Number,
            default:this.totalCapacityFourWheeler
          },
          availableThreeWheeler:{
            type:Number,
            default: ()=>{
              return this.totalCapacityThreeWheeler
            }
          },
          availableTwoWheeler:{
            type:Number,
            default: ()=>{
              return this.totalCapacityTwoWheeler
        }
    },
},
        {timestamps:true

    })
    module.exports = mongoose.model('Capacity',capacitySchema);


    