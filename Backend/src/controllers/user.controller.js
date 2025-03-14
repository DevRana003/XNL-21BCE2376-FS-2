import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { uploadoncloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const genrateTokens = async(userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})
        
        return {refreshToken,accessToken}
    } catch (error) {
        throw new ApiError(500, error.message||"error in generate token method");
    }

}

const registerUser = asyncHandler(async(req,res)=>{

    const{fullName , email , username , password} = req.body;
    
    if([fullName , email , username , password].some((field)=>field?.trim()===""))
    {
        throw new ApiError(400,"All fields are required");
    }

    const alreadyexist = await User.findOne({
        $or:[{username},{email}]
    })

    if(alreadyexist) throw ApiError(402,"useralready existed");

    const avatarlocalpath = req.files?.avatar[0]?.path;

    if(!avatarlocalpath) throw new ApiError(400, "avatar image is required");

    const avatar = await uploadoncloudinary(avatarlocalpath);

    if(!avatar) throw new ApiError(500, "error at server side uploading on cloudinary")

    const user = await User.create({
        fullName,
        avatar:avatar.url,
        username, 
        email,
        password
    })

    const createduser = await User.findById(user._id).select("-password -refreshToken")

    if(!createduser) throw new ApiError(500 , "error occur while uploading data to atlas server")

    return res.status(201).json(
        new ApiResponse(200,createduser,"user created successfully")
    )

})

const loginUser = asyncHandler(async(req,res)=>{    
    const {username , password} = req.body;

    if(!username)
    {
        throw new ApiError(400,"username or email is required ")
    }

    const user = await User.findOne({username});
    console.log(user._id);
    if(!user) throw new ApiError(404,"user does not exist");

    const ispassvalid = await user.isPasswordcorrect(password)
    if(!ispassvalid) throw new ApiError(401,"invalid password")

    const {refreshToken , accessToken} = await genrateTokens(user._id);

    const loggedinuser = await User.findOne(user._id).select("-password");

    const options = {
        httpOnly:true,
        Secure : true,
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,{user:loggedinuser,accessToken,refreshToken},"user logged in successfully"))

})

const  logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{refreshToken:1}
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly:true,
        Secure : true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"user logged out"))
})

const refreshAccessToken = asyncHandler(async(req,res)=>{

    try {
        const incomingtoken = req.cookies.refreshToken || req.body.refreshToken
    
        if(!incomingtoken) throw new ApiError(400,"Incoming token not found");
    
        const decodedtoken = jwt.verify(incomingtoken,process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedtoken._id);
    
        if(!user) throw new ApiError(400, "user with decoded token not found");
    
        if(incomingtoken!==user.refreshToken) throw new ApiError(400, " token do not match ")
    
        const{refreshToken,accessToken } = await genrateTokens(user._id)
        console.log(refreshToken)
        console.log(accessToken)
        const options = {
            httpOnly:true,
            Secure: true
        }
    
        return res.status(200)
        .cookie("accesstoken",accessToken,options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200,{accessToken ,refreshToken},"access token refreshed successfully"))
    } catch (error) {
        throw new ApiError(400,"error in the updating token of try catch ")
    }

})

const changeUserPassword = asyncHandler(async(req,res)=>{
    const {oldPassword , newPassword} = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordcorrect = await user.isPasswordcorrect(oldPassword)
    if(!isPasswordcorrect) throw new ApiError(400,"password is not correct")

    user.password = newPassword;
    await user.save({validateBeforeSave:false});

    return res
    .status(200)
    .json(new ApiResponse(200,{},"password changed successfully")) 

})

const getCurrentUser = asyncHandler(async (req,res)=>{
    console.log(req.user);
    return res
    .status(200)
    .json(new ApiResponse(200,req.user,"current user fetched"))
})

const updateAccountDetails = asyncHandler(async(req,res)=>{
    const {fullName , email } = req.body
    if(!(fullName||email))
    {
        throw new ApiError(400,"full name or email")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullName , 
                email
            }
        },
        {new:true}
        ).select("-password -refreshToken")

    return res
    .status(200)
    .json(new ApiResponse(200, user , "Account details updated successfully "))
    

})

const changeUseravatar = asyncHandler(async(req,res)=>{

    const avatarlocal = req.user?.avatar

    const newAvatar = req.file.avatar

    if(!newAvatar) throw new ApiError(400, "no new avatar found");

    const avatar = await uploadoncloudinary(newAvatar)

    if(!avatar) throw new ApiError(400,"no response from cloudinary while uploading new avatar")

    const user = User.findByIdAndUpdate(req.user?._id,{$set:{avatar:avatar.url}},{new:true}).select("-password -refreshToken")

    return res.status(200).json(new ApiResponse(200,{user},"successfull changed avatar"))
})

export { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeUserPassword,
    getCurrentUser,
    updateAccountDetails,
    changeUseravatar,
}           