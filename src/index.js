import dotenv from "dotenv"
import mongoose, { connect }  from "mongoose";  
import { DB_NAME } from "./constants.js";
import express from "express"
import connectDB from "./db/index.js"
import {app} from "./app.js"

dotenv.config({
    path: './env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
})
.catch((error)=>{
    app.on("error", ()=>{
        console.log("ERROR:", error);
        throw error
    })
})

/*
;(async()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URL}/$
            {DB_NAME}`)
            app.on("error", ()=>{
                console.log("ERROR: ", error);
                throw error
            })
            app.listen(process.env.PORT, ()=>{
                console.log(`App is listening on port ${process.env.PORT}`);
            })
    }
    catch(error){
        console.error("ERROR: ", error)
        throw error
    }
})()
*/
