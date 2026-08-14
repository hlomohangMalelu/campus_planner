import "dotenv/config";
import express from "express";
import connectDB from "./src/db/connect.js";
import authRouter from "./src/routes/auth.js";
import semesterRouter from "./src/routes/semester.routes.js";
import courseRouter from "./src/routes/course.routes.js";
import authorizeUser from "./src/middleware/auth.js";
import notFoundMiddleware from "./src/middleware/not-found.js";
import errorHanderMiddleware from "./src/middleware/error-handler.js";

const app = express();
const port = process.env.PORT || 8000;

//middleware
app.use(express.json()); //json parser


app.get('/',(req,res) => {  
    res.send('Campus Planner running');
})

app.use('/api/v1/auth',authRouter);
app.use('/api/v1/semesters',authorizeUser,semesterRouter);
app.use('/api/v1/courses', authorizeUser, courseRouter);

app.use(notFoundMiddleware); // Handle 404 for undefined routes
app.use(errorHanderMiddleware); // Handle errors globally

const start = async () => {
    try{
        await connectDB(process.env.MONGO_URI);
        app.listen(port,console.log(`Server listening on port: ${port}`));
    }catch(err) {
        console.log(err);
    }
}

start();