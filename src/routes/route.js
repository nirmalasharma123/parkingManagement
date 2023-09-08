const express= require('express');
const router = express.Router();
const {userSignUP,userLogin} = require("../controller/userController");
const {createParking,createHourlyRating,vehicleEntry,vehicleExit} = require("../controller/parkingController");
const {createVehicle} = require("../controller/vehicaleController");


router.post('/signUp',userSignUP);
router.post('/signIn',userLogin);
router.post('/createParking',createParking);
router.post('/createHourlyRating',createHourlyRating);
router.post('/vehicleEntry',vehicleEntry);

router.post('/createVehicle',createVehicle);
router.post('/vehicleExit',  vehicleExit)


module.exports= router;