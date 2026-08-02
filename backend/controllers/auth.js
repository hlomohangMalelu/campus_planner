import "dotenv/config";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const register = (req, res) => {

    res.json(req.validatedData);
}
