const mongoose = require('mongoose');
const parkingSchema = new mongoose.Schema({
    area :{
        type: String,
        required: true
    },
    lot: {
        type :String,
        required: true
    }},

    {timestamps:true

})

module.exports = mongoose.model('Parking', parkingSchema);