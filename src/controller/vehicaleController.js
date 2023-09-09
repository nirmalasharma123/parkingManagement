const parkingEntryModel = require('../model/parkingEntary');
const vehicleModel = require('../model/vehicleModel');
const parkingModel = require('../model/parkingModel');
const parkingCapacityModel = require('../model/parkingLotCapacity');

const createVehicle = async (req, res) => {
  try {
    let body = req.body
    let userId = req.decode
    if (!body.type) {
      return res.status(400).send({ status: false, message: "PLease enter type of vehicle" })
    }
    if (!body.vehicleNumber) {
      return res.status(400).send({ status: false, message: "Please enter vehicle number" });
    }
    body.userId = userId

    let createVehicle = await vehicleModel.create(body)
    return res.status(201).send({ status: true, message: "vehicle created Successfully", data: createVehicle })
  } catch (err) {
    return res.status(500).send({ status: false, message: "Server error" })
  }
};

const getCarParkingHistory = async (req, res) => {
  try {
    const vehicleNumber = req.body.vehicleNumber;
    if (!vehicleNumber) return res.status(400).send({ status: false, message: "Please enter vehicle number" })

    const vehicleData = await vehicleModel.findOne({ vehicleNumber: vehicleNumber });
    console.log(vehicleData);

    if (!vehicleData) {
      return res.status(400).send({ status: false, message: "Vehicle not found" });
    }

    const vehicleId = vehicleData._id;
    
    if(vehicleData.userId !=req.decode) return res.status(401).send({ status: false, message: "Unauthorized access1" })

    const historyData = await parkingEntryModel
      .find({ vehicleId })
      .populate({
        path: "parkingId",
        select: "area lot -_id",
        model: "Parking",
      })
      .select("entryTime exitTime amountPaid -_id");

    if (!historyData || historyData.length === 0) {
      return res.status(400).send({ status: false, message: "No history found" });
    }

    const parkingHistory = historyData.map((history) => {
  
      const entry = new Date(history.entryTime);
      const exit = new Date(history.exitTime);
      const durationInMilliseconds = exit - entry;

      const hours = Math.floor(durationInMilliseconds / (1000 * 60 * 60));
      const minutes = Math.floor((durationInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((durationInMilliseconds % (1000 * 60)) / 1000);

      return {
        area: history.parkingId.area,
        lot: history.parkingId.lot,
        amountPaid: history.amountPaid,
        entryTime: history.entryTime,
        exitTime: history.exitTime,
        duration: {
          hours,
          minutes,
          seconds,
        },
      };
    });

    return res.status(200).send({
      status: true,
      message: "Parking history fetched successfully",
      data: parkingHistory,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: false, message: "Internal Server Error" });
  }
};

const searchForParkingSpot = async (req, res) => {
  try {
    const { area, lot, vehicleType } = req.body;
    const validVehicleTypes = ['Two-Wheeler', 'Three-Wheeler', 'Four-Wheeler'];

    if (!validVehicleTypes.includes(vehicleType)) {
      return res.status(400).send({ status: false, message: "Invalid vehicle type" });
    }

    const parkingSpot = await parkingModel.findOne({ area, lot }).select("area,lot");
    if (!parkingSpot) return res.status(404).send({ status: false, message: "Parking spot not found" });

    const parkingAvailability = await parkingCapacityModel.findOne({ parkingId: parkingSpot._id });
    if (!parkingAvailability) return res.status(404).send({ status: false, message: "No data at the moment" });

    let parkingAvailable = false;

    if (vehicleType === "Two-Wheeler" && parkingAvailability.availableTwoWheeler > 0) {
      parkingAvailable = true;
    }
    if (vehicleType === "Three-Wheeler" && parkingAvailability.availableThreeWheeler > 0) {
      parkingAvailable = true;
    }
    if (vehicleType === "Four-Wheeler" && parkingAvailability.availableFourWheeler > 0) {
      parkingAvailable = true;
    }

    if (parkingAvailable) {
      return res.status(200).send({ status: true, message: "Parking spot available", parkingSpot });
    } else {
      return res.status(404).send({ status: false, message: "Parking spot not available" });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: "Internal Server Error" });
  }
};

module.exports = { createVehicle, getCarParkingHistory, searchForParkingSpot }