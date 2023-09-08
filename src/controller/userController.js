const  bcrypt = require("bcrypt");
const userModel= require("../model/userModel");
const validator = require('../validation');
let jwt = require("jsonwebtoken");


const userSignUP = async function (req, res) {
    try {
      let data = req.body;
      let { error} = validator.userValidationSchema.validate(data);
      if (error) {
        return res.status(400).send(error.details[0].message + "joi");
  
      }
      let { email, password, phoneNo} = data;
  
      let user = await userModel.findOne({
        $or: [{ email: email },{phoneNo:phoneNo}],
      });
      if (user) {
        if (user.email === email)
          return res
            .status(400)
            .send({ status: false, message: `${email} is already in use` });
        if (user.phoneNo === phoneNo)
          return res
            .status(400)
            .send({ status: false, message: `${phoneNo} already in use` });
      }
  
      const saltRounds = password.length;
      let hash = await bcrypt.hash(password, saltRounds);
      data.password = hash;
      
     await userModel.create(data);

      res
        .status(201)
        .send({
          status: true,
          message: "User created successfully"
        });
    } catch (err) {
      return res.status(500).send({ status: false, message: err.message });
    }
  };
  
  let userLogin = async function (req, res) {
    try{
  
    let { error} = validator.logiValidation.validate(req.body);
      if (error) {
        return res.status(400).send(error.details[0].message + "joi");
      }
    let { email, password } = req.body;
  
    let findUser = await userModel.findOne({ email: email });
  
    if (!findUser)
      return res.status(404).send({ status: false, message: "user not found" });
  
    let checkPassword = await bcrypt.compare(password, findUser.password);
    if (!checkPassword)
      return res
        .status(400)
        .send({ status: false, message: "Incorrect credential" });
  
    let token = jwt.sign({ userId: findUser._id.toString() }, "secreteKey");
    return res.status(200).send({ status: true, token: token })
    }catch(err){
      return res.status(500).send({status:false,message:err.message})
  }
}
  

module.exports ={userSignUP,userLogin}