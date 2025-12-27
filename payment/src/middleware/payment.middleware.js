const jwt = require('jsonwebtoken');

function authPayment(roles = ['user']){
    
    return function productMiddleware(req,res,next){
        const token = (req.cookies && req.cookies.token) || (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[1]);

        if(!token){
            return res.status(401).json({
                message:'unauthorized token: no token provided'
            })
        }

        try {
            
            const decoded = jwt.verify(token,process.env.JWT_KEY);

            const allowed = Array.isArray(roles) ? roles : [roles];
            if(!allowed.includes(decoded.role)){
                return res.status(403).json({
                    message:'unauthorized forbidden role'
                })
            }

            req.user = decoded;
            next();

        } catch (err) {
            return res.status(401).json({
                message:"unauthorized invalid token",
                error:err.message
            })
        }
    }

}

module.exports = {
    authPayment
}