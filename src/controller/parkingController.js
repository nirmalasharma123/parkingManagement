const parkingModel = require("../model/parkingModel");
const capacityModel = require("../model/parkingLotCapacity");
const rateModel = require("../model/rateModel");
const parkingEntryModel = require("../model/parkingEntary");
const vehicleModel = require("../model/vehicleModel");

const createParking = async (req, res) => {
  let {
    area,
    lot,
    totalCapacityFourWheeler,
    totalCapacityThreeWheeler,
    totalCapacityTwoWheeler,
  } = req.body;
  if (
    !area ||
    !lot ||
    !totalCapacityFourWheeler ||
    !totalCapacityThreeWheeler ||
    !totalCapacityTwoWheeler
  )
    res.status(400).send({ message: "Please fill all the fields" });

  const parkingData = {
    lot,
    area,
  };

  const parkingCreate = await parkingModel.create(parkingData);
  const capacityData = {
    totalCapacityFourWheeler,
    totalCapacityTwoWheeler,
    totalCapacityThreeWheeler,
    availableFourWheeler: totalCapacityFourWheeler,
    availableThreeWheeler: totalCapacityThreeWheeler,
    availableTwoWheeler: totalCapacityTwoWheeler,
    parkingId: parkingCreate._id,
  };

  await capacityModel.create(capacityData);

  return res
    .status(201)
    .send({ status: true, message: "parking created successfully" });
};

const createHourlyRating = async (req, res) => {
  const { parkingId, vehicleType, uptoTwoHour, twoToFour, moreThenFour } =
    req.body;
  let data = req.body;
  if (!parkingId || !vehicleType || !uptoTwoHour || !twoToFour || !moreThenFour)
    res.status(400).send({ message: "Please fill all the fields" });

  const createRating = await rateModel.create(data);

  return res
    .status(201)
    .send({
      status: true,
      message: "Hourly Rating is  successfully created",
      data: createRating,
    });
};

const vehicleEntry = async (req, res) => {
  let { vehicleNumber, parkingId } = req.body;

  const vehicleData = await vehicleModel.findOne({ vehicleNumber });

  if (!vehicleData)
    return res.status(400).send({ message: "Vehicle does not exist" });


  const currentDateTime = new Date();
  const options = {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  const formattedDateTime = currentDateTime.toLocaleString("en-IN", options);

  const parkingEntryData = {
    vehicleId: vehicleData._id,
    parkingId,
    entryTime: formattedDateTime,
  };

  const vacantSpace = await capacityModel.findOne({ parkingId });
  let vehicleType;

  if (vehicleData.type === "Two-Wheeler") {
    vehicleType = "availableTwoWheeler";

    if (vacantSpace.availableTwoWheeler < 1) {
      return res.status(400).send({ status: false, message: "Parking Full" });
    }
  }
  if (vehicleData.type === "Three-Wheeler") {
    vehicleType = "availableThreeWheeler";

    if (vacantSpace.availableThreeWheeler < 1) {
      return res.status(400).send({ status: false, message: "Parking Full" });
    }
  }
  if (vehicleData.type === "Four-Wheeler") {
    vehicleType = "availableFourWheeler";

    if (vacantSpace.availableFourWheeler < 1) {
      return res.status(400).send({ status: false, message: "Parking Full" });
    }
  }

  const entryCreate = await parkingEntryModel.create(parkingEntryData);

  if (entryCreate) {
    await capacityModel.findOneAndUpdate(
      { parkingId: parkingId },
      { $inc: { [vehicleType]: -1 } },
      { new: true }
    );
  }
  return res
    .status(201)
    .send({
      status: true,
      message: "entry created successfully",
      data: entryCreate,
    });
};



const vehicleExit = async (req, res) => {
    try{
    const { vehicleNumber, parkingId } = req.body;
  
    const vehicleData = await vehicleModel.findOne({ vehicleNumber });
    if (!vehicleData) return res.status(400).send({ status: false, message: "Vehicle not found" });
  
    const currentDateTime = new Date();
    const options = {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    const formattedDateTime = currentDateTime.toLocaleString("en-IN", options);
  
    const updateData = await parkingEntryModel.findOneAndUpdate(
      { vehicleId: vehicleData._id },
      { $set: { exitTime: formattedDateTime } },
      { new: true }
    );
  
    let vehicleType;
  
    if (vehicleData.type === "Two-Wheeler") {
      vehicleType = "availableTwoWheeler";
    }
    if (vehicleData.type === "Three-Wheeler") {
      vehicleType = "availableThreeWheeler";
    }
    if (vehicleData.type === "Four-Wheeler") {
      vehicleType = "availableFourWheeler";
    }
  
    if (updateData) {
      await capacityModel.findOneAndUpdate(
        { parkingId },
        { $inc: { [vehicleType]: 1 } },
        { new: true }
      );
    }
  
    const costData = await rateModel.findOne({ vehicleType: vehicleData.type });
  
    const entryTime = new Date(updateData.entryTime);
    const exitTime = new Date(updateData.exitTime);
    const timeDifference = (exitTime - entryTime) / (1000 * 60 * 60); // Duration in hours
  
    let finalCost = null;
  
    if (timeDifference < 2) {
      finalCost = timeDifference * costData.uptoTwoHour;
    } else if (timeDifference >= 2 && timeDifference < 4) {
      finalCost = timeDifference * costData.twoToFour;
    } else if (timeDifference >= 4) {
      finalCost = timeDifference * costData.moreThenFour;
    }
  
    if (finalCost !== null) {
      const finalUpdate = await parkingEntryModel.findOneAndUpdate(
        { vehicleId: vehicleData._id },
        { $set: { amountPaid: finalCost } },
        { new: true }
      );
      return res.status(200).send({
        status: true,
        message: "Vehicle exit successful",
        data: finalUpdate,
      });
    }
}catch(error){
    return res.status(500).send({error:error.message});

}
  };
  
module.exports = { createParking, createHourlyRating, vehicleEntry ,vehicleExit};
