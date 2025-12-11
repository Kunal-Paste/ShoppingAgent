const userModel = require('../model/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function registerUser(req,res){

    const {username,email,password,fullName:{firstName,lastName}} = req.body

    const isUserExist = await userModel.findOne({
        $or : [
            {username},
            {email}
        ]
    });

    if(isUserExist){
        return res.status(409).json({messaage: "username or email already exist"});
    }

    const hash = await bcrypt.hash(password,10);

    const user = await userModel.create({
        username,
        email,
        password:hash,
        fullName:{firstName,lastName}
    })

    const token = jwt.sign({
        id:user._id,
        username:user.username,
        email:user.email,
        role:user.role
    }, process.env.JWT_KEY, {expiresIn: '1d'});

    res.cookie("token",token, {
        httpOnly:true,
        secure:true,
        maxAge:24*60*60*1000,
    })

    res.status(201).json({
        message:"user registered successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
            fullName:user.fullName,
            role:user.role,
            addresses:user.addresses
        }
    })


}

module.exports = {
    registerUser
}