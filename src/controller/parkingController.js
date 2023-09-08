const parkingModel = require("../model/parkingModel");
const capacityModel = require("../model/parkingLotCapacity");

const createParking = async (req,res) => {
    let {area, lot,totalCapacityFourWheeler,totalCapacityThreeWheeler,totalCapacityTwoWheeler } = req.body;
    if(!area || !lot || !totalCapacityFourWheeler || !totalCapacityThreeWheeler || !totalCapacityTwoWheeler) res.status(400).send({message:"Please fill all the fields"})
    
    const parkingData = {
      lot,
      area
    }
    
    const parkingCreate = await parkingModel.create(parkingData)
    const capacityData = {
      totalCapacityFourWheeler,
      totalCapacityTwoWheeler,
      totalCapacityThreeWheeler,
      parkingId:parkingCreate._id
    } 
    
    const capacityCreate = await capacityModel.create(capacityData)
    
    return res.status(201).send({status:true,message:"parking created successfully"})

  }

  module.exports = {createParking};