import JWT from "jsonwebtoken";
import { User } from "../models/UserModel.js";

//protected Routes token base
export const requireSignIn = async (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1] || req.cookies?.token || req.query?.token;
    if (!token) {
      return res.status(403).json({ message: 'Token is required' });
    }
    // Verify the JWT token
    JWT.verify(token,  process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        // Handle JWT errors
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({success: false, message: 'Token has expired' });
        }
        if (err.name === 'JsonWebTokenError') {
          return res.status(400).json({ success: false, message: 'Invalid token' });
        }
        return res.status(500).json({ success: false, message: 'Failed to authenticate token' });
      }

      // Attach the decoded payload to the request object
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.log(error);
  }
};