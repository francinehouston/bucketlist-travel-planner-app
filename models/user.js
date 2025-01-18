const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema ({
    title: { 
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    startDate: {
        type: String,
        required: true,
    },
    endDate:{
        type: String,
        required: true,
    },
    activities:{
        type: String
    },
    
});

const userSchema = new mongoose.Schema ({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    trips: [tripSchema],
});
const User= mongoose.model("User",userSchema);

module.exports = User;