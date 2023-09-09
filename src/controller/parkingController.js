const parkingModel = require("../model/parkingModel");
const capacityModel = require("../model/parkingLotCapacity");
const rateModel = require("../model/rateModel");
const parkingEntryModel = require("../model/parkingEntary");
const vehicleModel = require("../model/vehicleModel");

const createParking = async (req, res) => {
    try {
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
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};

const createHourlyRating = async (req, res) => {
    try {
        const { parkingId, vehicleType, uptoTwoHour, twoToFour, moreThenFour } =
            req.body;
        let data = req.body;
        if (!parkingId || !vehicleType || !uptoTwoHour || !twoToFour || !moreThenFour)
            res.status(400).send({ message: "Please fill all the fields" });

        const validVehicleTypes = ['Two-Wheeler', 'Three-Wheeler', 'Four-Wheeler'];

        if (!validVehicleTypes.includes(vehicleType)) {
            return res.status(400).send({ status: false, message: "Invalid vehicle type" });
        }

        const createRating = await rateModel.create(data);

        return res
            .status(201)
            .send({
                status: true,
                message: "Hourly Rating is  successfully created",
                data: createRating,
            });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};

const vehicleEntry = async (req, res) => {
    try {
        let { vehicleNumber, parkingId } = req.body;
        if (!vehicleNumber || !parkingId) return res.status(400).send({ message: "Please fill all the fields" });

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
        if (!vacantSpace) return res.status(500).send({ status: false, message: "No data" });

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
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};



const vehicleExit = async (req, res) => {
    try {
        const { vehicleNumber, parkingId } = req.body;

        if (!vehicleNumber || !parkingId) {
            return res.status(400).send({ message: "Please fill all the fields" });
        }

        const vehicleData = await vehicleModel.findOne({ vehicleNumber });

        if (!vehicleData) {
            return res.status(400).send({ status: false, message: "Vehicle not found" });
        }

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
            { vehicleId: vehicleData._id, vehicleExited: false },
            { $set: { exitTime: formattedDateTime } },
            { new: true }
        );

        if (updateData === null) {
            return res.status(400).send({ status: false, message: "Vehicle not found in db" });
        }

        let vehicleType;

        if (vehicleData.type === "Two-Wheeler") {
            vehicleType = "availableTwoWheeler";
        } else if (vehicleData.type === "Three-Wheeler") {
            vehicleType = "availableThreeWheeler";
        } else if (vehicleData.type === "Four-Wheeler") {
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
        const timeDifference = Math.floor((exitTime - entryTime) / (1000 * 60 * 60));

        let finalCost = null;

        if (timeDifference < 2) {
            finalCost = costData.uptoTwoHour;
        } else if (timeDifference >= 2 && timeDifference < 4) {
            finalCost = costData.twoToFour;
        } else if (timeDifference >= 4 && timeDifference < 6) {
            finalCost = costData.moreThenFour;
        } else if (timeDifference >= 6) {
            finalCost = (timeDifference - 6) * 10 + costData.moreThenFour;
        }
        console.log(finalCost)

        if (finalCost !== null) {
            const updatedEntry = await parkingEntryModel.findOneAndUpdate(
                { vehicleId: vehicleData._id, vehicleExited: false },
                { $set: { amountPaid: finalCost }, vehicleExited: true },
                { new: true }
            );

            if (!updatedEntry) {
                return res.status(500).send({ status: false, message: "Failed to update amountPaid" });
            }

            return res.status(200).send({
                status: true,
                message: "Vehicle exit successful",
                data: {
                    duration: {
                        hours: timeDifference,
                        minutes: (timeDifference % 1) * 60,
                        seconds: (timeDifference % (1 / 60)) * 3600,
                    },
                    dueAmount: finalCost,
                },
            });
        }

        return res.status(200).send({
            status: true,
            message: "Vehicle exit successful",
        });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports = { createParking, createHourlyRating, vehicleEntry, vehicleExit };
