import "dotenv/config";
import express from "express";
import connectDB from "./src/db/connect.js";
import authRouter from "./src/routes/auth.js";
import semesterRouter from "./src/routes/semester.routes.js";
import authorizeUser from "./src/middleware/auth.js";

const app = express();
const port = process.env.PORT || 8000;

//middleware
app.use(express.json()); //json parser


app.get('/',(req,res) => {  
    res.send('Campus Planner running');
})

app.use('/api/v1/auth',authRouter);
app.use('/api/v1/semesters',authorizeUser,semesterRouter);


const start = async () => {
    try{
        await connectDB(process.env.MONGO_URI);
        app.listen(port,console.log(`Server listening on port: ${port}`));
    }catch(err) {
        console.log(err);
    }
}

start();