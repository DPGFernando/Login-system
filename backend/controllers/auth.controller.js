import bcryptjs from "bcryptjs";
import crypto from "node:crypto";    
import dotenv from "dotenv";
import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../util/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendPasswordResetSuccessMail } from "../mailtrap/email.js";

dotenv.config();

export const signup = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        if(!email || !password || !name) {
            throw new Error("All fields are required");
        }

        const userAlreadyExists = await User.findOne({email});
        if(userAlreadyExists) {
            return res.status(400).json({success:false, message: "User already exists"});
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000);

        const user = new User({
            email, 
            password: hashedPassword, 
            name, 
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
        });

        await user.save();

        generateTokenAndSetCookie(res, user._id);

        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success:true, 
            message: "User created Successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        });;

    } catch (error) {
        res.status(400).json({success:false, message: error.message});
    }
};

export const verifyEmail = async (req, res) => {
    const {code} = req.body;

    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: {$gt: Date.now()}
        });

        if (!user){
            return res.status(400).json({success:false, message: "Invalid or expired verification code"});
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success:true, 
            message: "Email verified successfully", 
            user: {
                ...user._doc,
                password: undefined
            }
        });

    } catch (error) {
        console.log("Error verifying email", error);
        res.status(500).json({success:false, message: "Error verifying email"});
    }
};

export const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success: false, message: "Invalid Credential"});
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(400).json({success: false, message: "Invalid Credential"}); 
        }

        generateTokenAndSetCookie(res, user._id);

        user.lastlogin = new Date();
        await user.save();

        res.status(200).json({
            success:true, 
            message: "User login successfully", 
            user: {
                ...user._doc,
                password: undefined
            }
        });

    } catch (error) {
        console.log("Error in login ", error);
        return res.status(400).json({success: false, message: error.message}); 
    }
};

export const forgotPassword = async (req, res) => {
    const {email}  = req.body;

    try {
        const user = await User.findOne({email});

        if (!user){
            return res.status(400).json({success:false, message: "Invalid Credential"});
        }

        //Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpireAt = Date.now() + 1 * 60 * 60 * 1000;

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpireAt;

        await user.save();

        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({
            success:true, 
            message: "Password Reset Link was sent successfully", 
        });
        
    } catch (error) {
        console.log("Error sending password reset link", error);
        res.status(500).json({success:false, message: "Error sending password reset link"});
    }
};

export const resetPassword = async (req, res) => {
    const {password} = req.body;
    const {token} = req.params;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: {$gt: Date.now()}
        });

        if(!user){
            return res.status(400).json({success:false, message: "Invalid or expired reset token"});
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save();
        await sendPasswordResetSuccessMail(user.email);

        res.status(200).json({
            success:true, 
            message: "Password Reset successfully", 
        });

    } catch (error) {
        console.log("Error resetting password", error);
        res.status(400).json({success:false, message: "Error resetting password"});
    }
};

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({success: true, message: "Loggedout successfully"});
};

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");

        if(!user){
            return res.status(401).json({success: false, message: "Access denied"});
        }

        res.status(200).json({success: true, user});    
    } catch (error) {
        console.log("Error in checkAuth ", error);
        return res.status(400).json({success: false, message: error.message});
    }
};