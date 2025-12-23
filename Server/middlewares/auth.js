const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");


// auth this middleware is for verifying JWT token 
exports.auth = async (req, res, next) =>{
    try{
        const token = req.cookies.token 
        || req.body.token 
        || (req.header("Authorization") ? req.header("Authorization").replace("Bearer ", "").trim() : null);

        // if token missing , then return response
        if(!token){
            return res.status(401).json({
                success:false,
                message:'Token is missing',
            });
        }

        // verifying the token correct or not
        try{
            const decode =  jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode); 
            req.user = decode;
        } 
        catch(error){
            return res.status(401).json({
                success:false,
                message: error.name === 'TokenExpiredError' ? 'Token has expired. Please login again.' : 'Token is invalid',
            });
        }
        next();
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:'something went wrong while validating the token',
        });
    }
} 


// isStudent
exports.isStudent = async (req, res, next) =>{
    try{
        console.log("🔐 isStudent middleware - accountType:", req.user.accountType);
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Students only",
            });
        }
        console.log("✅ isStudent middleware passed");
        next();
    }
    catch(error){
        console.log("❌ isStudent middleware error:", error);
        return res.status(401).json({
            success:false,
            message:"User role cannot be verified, Please try again",
        });
    }
}

//  isInstructor
exports.isInstructor = async (req, res, next) =>{
    try{
        console.log("isInstructor middleware - User account type:", req.user.accountType);
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Instructor only",
                userAccountType: req.user.accountType
            });
        }
        next();
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:"User role cannot be verified, Please try again",
        });
    }
}

// Admin
exports.isAdmin = async (req, res, next) =>{
    try{
        // for debug 
            // console.log("printing accountType", req.user.accountType);

        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Admin only",
            });
        }
        next();
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:"User role cannot be verified, Please try again",
        });
    }
}