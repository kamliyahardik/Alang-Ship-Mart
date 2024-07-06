const mongoose = require("mongoose");



const googleSchema = new mongoose.Schema({
    googleId: String,
    displayName: String,
    image: String,
    email: String
})

const Googledata = mongoose.model("Googledata", googleSchema);

// Export model
module.exports = Googledata;
