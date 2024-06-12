const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/CodeLab')
.then(()=>{
    console.log('mongoDB connected');
}). catch(()=>{
    console.log('mongoDB is not connected')
})
.catch(()=>{
    console.log("failed to connect");
});



const questionSchema = mongoose.Schema({
    username:{
        type:String,
        required: true,
        // unique: true,
    },
    subject:{
        type:String,
        required : true,
    },
    question:{
        type:{
            id:{
                type:Number,
                required : true,
            },
            problemStatement:{
                type:String,
                required : true,
            },
            // testCases:{
            //     type:Array,
            // },
        }

    }
})

const assignment = new mongoose.model("Assignment", questionSchema)

module.exports = assignment;

