const mongoose = require("mongoose");

mongoose
    .connect('mongodb://127.0.0.1:27017/CodeLab')
    .then(() => {
        console.log("mongoDB connected");
    })
    .catch(() => {
        console.log("mongoDB is not connected");
    })
    .catch(() => {
        console.log("failed to connect");
    });

const LoginSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    // submission: {
    //     subject: {
    //         type: String,
            
    //     },
    //     assignment: {
    //         type: String,
            
    //     },
    //     id: {
    //         type: Number,
            
    //     },
    //     code: {
    //         type: String,
            
    //     },
    // },
});

const collection = new mongoose.model("User", LoginSchema);

module.exports = collection;
