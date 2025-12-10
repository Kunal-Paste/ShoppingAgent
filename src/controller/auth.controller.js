const userModel = require('../model/user.model')

async function registerUser(req,res){
    const {username,email,password,fullName:{firstName,lastName}} = req.body

    
}

module.exports = {
    registerUser
}