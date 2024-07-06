const mongoose = require("mongoose");

mongoose
    .connect("mongodb://127.0.0.1:27017/loginpage")
    .then(() => {
        console.log("MongoDB Connected Successfully");
    })
    .catch((err) => {
        console.error("Error Connecting to MongoDB:", err);
    });

// Define schema for the collection
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    userId: { type: String, required: true, unique: true },

});

const User = mongoose.model("User", userSchema);

// Export model
module.exports = User;
