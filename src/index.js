const express =  require("express");
const mongoose = require("mongoose");
const router = require("./routes/route");
const app= express();

app.use(express.json());


mongoose.connect("mongodb+srv://jassu_172:jassusharma123@cluster0.fhbdfgf.mongodb.net/parkingLotManagementSystem",{useNewUrlParser:true})
.then(()=>console.log("mongoDb is connect"))
.catch((err)=>console.log(err))

app.use("/",router);
app.listen(3001,function(){
    console.log("App is live on port 3001")
})