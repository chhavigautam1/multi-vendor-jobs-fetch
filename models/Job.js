//Requiring Mongoose
const mongoose = require('mongoose')

//Creating Schema
const jobSchema = new mongoose.Schema({
    requestId:{
        type:String,
        required:true,
        unique:true
    },
    status:{
        type:String,
        enum:['pending','processing','complete','failed'],
        default:'pending'
    },
    vendor:{
        type:String,
        enum:['sync','async'],
        required:true
    },
    payload:{
        type:Object,
        required:true
    },
    result:{
        type: Object,
        default:null
    }
}, {timestamps:true})

module.exports = mongoose.model('Job',jobSchema)