const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/CodeLab')
.then(()=>{
    console.log('mongoDB connected');
}). catch(()=>{
    console.log('mongoDB is not connected')
})
.catch(()=>{
    console.log("failed to connect");
})

const outputSchema = mongoose.Schema({
    question:{
        type:String,
        required : true,
    },
    id:{
        type:String,
        required : true,
    },
    code:{
        type:String,
        required : true,
    },
    // input:{
    //     type:String,
    //     required : true,
    // },
    output:{
        type:String,
        required : true,
    }
});
const submissionSchema = mongoose.Schema({
    username:{
        type:String,
        required: true,
    },
    subject:{
        type:String,
        required : true,
    },
    output:{
        type:[outputSchema]
    }
});

const submission = new mongoose.model("Submission", submissionSchema);

module.exports = submission;