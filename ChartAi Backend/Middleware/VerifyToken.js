import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const VerifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Access Denied: No token provided." });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        return res.status(400).json({ message: "Invalid Token" });
    }
};

export default VerifyToken;
