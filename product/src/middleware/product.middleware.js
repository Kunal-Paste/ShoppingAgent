const jwt = require('jsonwebtoken');

function authProduct([roles='user']){
    
    return function productMiddleware(req,res,next){
        const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];

        if(!token){
            return res.status(401).json({
                message:'unauthorized token: no token provided'
            })
        }

        try {
            
            const decoded = jwt.verify(token,process.env.JWT_KEY);

            if(!roles.includes(decoded.role)){
                return res.status(403).json({
                    message:'unauthorized forbidden role'
                })
            }

            const user = decoded;
            next();

        } catch (error) {
            return res.status(401).json({
                message:"unauthorized invalid token"
            })
        }
    }

}

module.exports = {
    authProduct
}