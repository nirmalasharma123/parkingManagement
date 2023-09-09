const express= require('express');
const router = express.Router();
const {userSignUP,userLogin} = require("../controller/userController");
const {createParking,createHourlyRating,vehicleEntry,vehicleExit} = require("../controller/parkingController");
const {createVehicle,getCarParkingHistory,searchForParkingSpot} = require("../controller/vehicaleController");
const {authentication} =require("../middleware/authentication")

//user Login
router.post('/signUp',userSignUP);
router.post('/signIn',userLogin);

///registering parking lots
router.post('/createParking',createParking);

//creating hourly rates for each parking
router.post('/createHourlyRating',createHourlyRating);

///creating vehicle for each user

router.post('/createVehicle',authentication,createVehicle);

/////==============vehicle entry===========
router.post('/vehicleEntry',vehicleEntry);
///=====================vehicle exit=========
router.post('/vehicleExit',  vehicleExit);

//==================parking history for each car===============

router.get('/carParkingHistory',authentication,getCarParkingHistory);

///===========================searching parking spot

router.post('/searchParking',searchForParkingSpot)


module.exports= router;