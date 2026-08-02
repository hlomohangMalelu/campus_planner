import "dotenv/config";
import UnauthorizedError from "../errors/unauthorized.js";
import jwt from "jsonwebtoken";

const authorizeUser = async (req,res,next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('Not authorized to access this route');
    }

    const token = authHeader.split(' ')[1];
    
    try {
        const payload = jwt.verify(token,process.env.JWT_SECRET);
        const {userId} = payload;
        req.user = {
            userId
            //role,
            //universityId

        };

        return next();
    } catch (error) {
        throw new UnauthorizedError('Not authorized to access this route');
    }
    
}

export default authorizeUser;