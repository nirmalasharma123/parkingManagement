const express= require('express');
const router = express.Router();
const {userSignUP,userLogin} = require("../controller/userController");


router.post('/signUp',userSignUP);
router.post('/signIn',userLogin);



module.exports= router;