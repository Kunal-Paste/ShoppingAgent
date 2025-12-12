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
        return res.status(409).json({message: "username or email already exist"});
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

async function loginUser(req, res){
    try{
        const body = req.body || {};
        const identifier = body.identifier || body.username || body.email;
        const password = body.password || body.pass;

        if(!identifier || !password){
            return res.status(400).json({ message: "identifier and password are required" });
        }

        const user = await userModel.findOne({
            $or: [ { username: identifier }, { email: identifier } ]
        }).select('+password');

        if(!user){
            return res.status(401).json({ message: "invalid credentials" });
        }

        const match = await bcrypt.compare(password, user.password || '');
        if(!match) return res.status(401).json({ message: "invalid credentials" });

        const token = jwt.sign({
            id:user._id,
            username:user.username,
            email:user.email,
            role:user.role
        }, process.env.JWT_KEY, {expiresIn: '1d'});

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 24*60*60*1000
        });

        return res.status(200).json({
            message: "login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                addresses: user.addresses
            }
        });
    } catch(err){
        console.error('login error', err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports = {
    registerUser,
    loginUser
}