const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: "user",
        required: true
    },
    token: {
        type: String,
        required: true,
    }
});

const Token = mongoose.model("token", TokenSchema)
export default Token;
