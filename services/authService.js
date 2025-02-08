import JWT from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "../models/UserModel.js";
import { comparePassword, hashPassword } from "../utils/authHelper.js";

export const login = async (userData, res) => {
  try {

    // Validation
    if (!userData.userName || !userData.password) {
      return {
        status: 400,
        data: {
          success: false,
          message: "Username and password are required.",
        },
      };
    }

    // Check if the user exists
    const user = await User.findOne({ userName: userData.userName });
    if (!user) {
      return {
        status: 404,
        data: {
          success: false,
          message: "User not found. Please register first.",
        },
      };
    }

    // Compare passwords
    const isMatch = await comparePassword(userData.password, user.password);
    if (!isMatch) {
      return {
        status: 401,
        data: {
          success: false,
          message: "Invalid password.",
        },
      };
    }

    // Generate token
    const token = JWT.sign(
      { _id: user._id }, // Payload
      process.env.JWT_SECRET, // Secret
      { expiresIn: "1h" } // Token expiry
    );

    return {
      status: 200,
      data: {
        success: true,
        message: "Login successful.",
        user: {
          id: user._id,
          userName: user.userName,
          name: user.name
        },
        token,
      },
    };
  } catch (error) {
    console.error("Error in LoginUser:", error);
    throw new Error("Service error during user registration");
  }
};


export const register = async (userData, res) => {
    try {
      // Validation
      if (!userData.userName) {
        return { status: 400, data: { message: "UserName is required" } };
      }
      if (!userData.name) {
        return { status: 400, data: { message: "Name is required" } };
      }
      if (!userData.password) {
        return { status: 400, data: { message: "Password is required" } };
      }
  
      // Check if the user already exists
      const existingUser = await User.findOne({ userName: userData.userName });
  
      if (existingUser) {
        return {
          status: 400,
          data: { 
            success: "false",
            message: "Already registered. Please log in." 
          },
        };
      }
  
      // Hash the password (placeholder for actual hashing logic)
      const hashedPassword = await hashPassword(userData.password);
  
      // Save the user
      const user = await new User({
        userName: userData.userName,
        name: userData.name,
        password: hashedPassword,
      }).save();
  
  
      return {
        status: 200,
        data: {
          success: "true",
          message: "User Registered Successfully.",
        },
      };
    } catch (error) {
      console.error("Error in createUser:", error);
      return {
        status: 500,
        data: {
          success: false,
          message: "Service error during user registration",
        },
      };
    }
  };