const jwt=require('jsonwebtoken');
const User=require('../model/user');

exports.authentication=async(req,res,next)=>{
    try{
        const token=req.header('Authorization');
        const user=jwt.verify(token,process.env.TOKEN_SECRET);
        const authorized=await User.findByPk(user.userid)
        if(authorized){
            req.user=authorized;
            next();
        }else{
            throw new Error({err:' * User not authorized'});
        }
    }catch(err){
        res.status(401).json({success:false,message:err})
    }
}