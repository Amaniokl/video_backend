import mongoose, { connect } from "mongoose";
import { DB_NAME } from "../constants.js"; // Ensure the correct relative path
import express from "express"

// const app=express();

const connectDB=async ()=>{
    try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
            console.log(`MongoDB connected !! DB Host: ${connectionInstance.connection.host}`)
            // app.on("error", ()=>{
            //     console.log("ERROR: ", error);
            //     throw error
            // })
            
    }
    catch(error){
        console.log("MongoDB connection error", error);
        process.exit(1);
    }
}

export default connectDB