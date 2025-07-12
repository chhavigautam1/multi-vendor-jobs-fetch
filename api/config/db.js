const mongoose=require('mongoose')
require('dotenv').config()

const connectDB= async () => {
    try {
        const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority&appName=Cluster0`;
        await mongoose.connect(uri)
        console.log("MongoDB connected Successfully!!")
    } catch (error) {
        console.error("Error Occured while connecting to mongoDB : ",error)
        
    }
    
}

module.exports=connectDB