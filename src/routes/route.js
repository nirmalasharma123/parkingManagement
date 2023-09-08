const express= require('express');
const router = express.Router();
const {userSignUP,userLogin} = require("../controller/userController");
const {createParking} = require("../controller/parkingController")


router.post('/signUp',userSignUP);
router.post('/signIn',userLogin);
router.post('/createParking',createParking);



module.exports= router;