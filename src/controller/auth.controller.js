const userModel = require('../model/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const redis = require('../db/redis')

async function registerUser(req,res){

    const {username,email,password,fullName:{firstName,lastName}, role} = req.body

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
        fullName:{firstName,lastName},
        role:role || 'user'
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

async function loginUser(req,res){
    try {
        
        const {username,email,password} = req.body;

        const user = await userModel.findOne({$or:[{email}, {username}]}).select('+password');

        if(!user){
            return res.status(401).json({message:"invalid credentials"});
        }

        const isMatch = await bcrypt.compare(password, user.password || '');

        if(!isMatch){
            return res.status(401).json({messaage:"invalid credentials"});
        }

        const token = jwt.sign({
            id:user._id,
            username:user.username,
            email:user.email,
            role:user.role
        }, process.env.JWT_KEY, {expiresIn: '1d'});

        res.cookie('token',token, {
            httpOnly:true,
            secure:true,
            maxAge: 24*60*60*1000,
        });

        return res.status(200).json({
            messaage:"user logined successfully ",
            user:{
                id:user._id,
                username:user.username,
                email:user.email,
                fullName:user.fullName,
                role:user.role,
                addresses:user.addresses
            }
        });

    } catch (error) {
        console.error('error in login user', error);
        return res.status(500).json({messaage:'internal server error'});
    }
}

async function getcurrentUser(req,res){
    return res.status(200).json({
        messaage: "current user fetched successfully",
        user:req.user
    })
}

async function logoutUser(req,res){
    const token = req.cookies.token;

    if(token){
        await redis.set(`blacklist:${token}`, 'true', 'EX', 24*60*60);
    }

    res.clearCookie('token',{
        httpOnly:true,
        secure:true,
    })

    return res.status(200).json({messaage: "user logged out successfully"});
}

async function getUserAddress(req,res){
    const id = req.user.id;

    const user = await userModel.findById(id).select('addresses');

    if(!user){
        return res.status(404).json({
            message:"user not found"
        })
    }

    return res.status(200).json({
        messaage:"user addresses fetched successfully",
        addresses:user.addresses
    });
}

async function addUserAddress(req,res){
    const id = req.user.id;

    const {street,city,state,pincode,country,isDefault}  = req.body;

    const user = await userModel.findOneAndUpdate({_id:id},{
        $push:{
            addresses:{
                street,
                city,
                state,
                pincode,
                country,
                isDefault
            }
        }
    },{new:true});

    if(!user){
        return res.status(404).json({
            message:"user not found"
        })
    }

    return res.status(201).json({
       messaage:"address added successfully",
       address:user.addresses[user.addresses.length-1]
    });
}

async function deleteUserAddress(req,res){
    const id = req.user.id;
    const {addressId} = req.params;

    const user = await userModel.findByIdAndUpdate({_id:id},{
        $pull:{
            addresses:{_id:addressId}
        }
    },{new:true});

    if(!user){
        return res.status(404).json({
            messaage:"user not found"
        });
    }

    const addressExists = user.addresses.some(add=> add._id.toString() === addressId);

    if(addressExists){
        return res.status(500).json({
            messaage:"failed to delete address"
        })
    }

    return res.status(200).json({
        message:"address deleted successfully",
        addresses:user.addresses
    });
}

module.exports = {
    registerUser,
    loginUser,
    getcurrentUser,
    logoutUser,
    getUserAddress,
    addUserAddress,
    deleteUserAddress
}