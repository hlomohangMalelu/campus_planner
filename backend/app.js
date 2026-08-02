import "dotenv/config";
import express from "express";
import connectDB from "./db/connect.js";

const app = express();
const port = process.env.PORT || 5000;

app.get('/',(req,res) => {
    res.send('Campus Planner running');
})



const start = async () => {
    try{
        await connectDB(process.env.MONGO_URI);
        app.listen(port,console.log(`Server listening on port: ${port}`));
    }catch(err) {
        console.log(err);
    }
}

start();