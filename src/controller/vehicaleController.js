

const vehicleModel = require('../model/vehicleModel')

const createVehicle = async (req, res) => {
   let body = req.body
    let userId = req.decode
    try{
        if(!body.type){
            return res.status(400).send({status:false, message:"PLease enter type of vehicle"})
        }
        if(!body.vehicleNumber){
            return res.status(400).send({status:false, message:"Please enter vehicle number"});
        }
        body.userId = userId


        let createVehicle = await vehicleModel.create(body)
        return res.status(201).send({status:true, message:"vehicle created Successfully", data:createVehicle})
    }catch(err){
        return res.status(500).send({status:false , message:"Server error"})
}
}

module.exports = {createVehicle}