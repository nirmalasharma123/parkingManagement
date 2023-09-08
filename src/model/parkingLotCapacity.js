const mongoose = require('mongoose');

    const capacitySchema = new mongoose.Schema({
        parking_id:{
            type:objectId,
            require: true
          },
          totalCapacityFourWheeler:{
            type:number,
            require:true
          },
          totalCapacityThreeWheeler:{
            type:number,
            require:true
          },
          totalCapacityTwoWheeler:{
            type:number,
            require:true
          },
          availableFourWheeler:{
            type:number,
            default: ()=>{
              return this.totalCapacityFourWheeler
            }
          },
          availableThreeWheeler:{
            type:number,
            default: ()=>{
              return this.totalCapacityThreeWheeler
            }
          },
          availableTwoWheeler:{
            type:number,
            default: ()=>{
              return this.totalCapacityTwoWheeler
        }
    },
},
        {timestamps:true

    })
    module.exports = mongoose.model('Capacity',capacitySchema);


    