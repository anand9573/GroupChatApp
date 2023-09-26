const sequelize=require('../util/database');
const user=require('../model/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

function isinvalid(string){
    if(string===undefined || string.length===0){
        return true
    }
    return false
}

exports.signup=async(req,res,next)=>{
let t=await sequelize.transaction();
try{
    const {name,email,phone,password}=req.body;
    if(isinvalid(name) || isinvalid(email) || isinvalid(phone) || isinvalid(password)){
        res.status(403).json({message:'user details are not valid fill all neccessary fields',success:true});
    }else{
        const User=await user.findOne({where:{email:email}});
        if(User){
            return res.status(200).json({message:'* Email already exist please login!',success:true})
        }else{
            const saltrounds=10;
            bcrypt.hash(password,saltrounds,async(err,hash)=>{
                if(hash){
                    await user.create({name,email,phone,password:hash,isLogin:false},{transaction:t});
                    await t.commit();
                    return res.status(201).json({message:'you have signed up successfully',success:true})
                }else{
                    throw new Error('something went wrong');
                }
            });
        }

    }
}catch(err){
        if (t) {
            await t.rollback();
        }
        res.status(500).json({error:err,success:false}) 
    }
}

function generateAccessToken(id,name,isLogin){
    return jwt.sign({userid:id,name,isLogin},process.env.TOKEN_SECRET)
}

exports.login=async(req,res,next)=>{
    try{
    const {email,password}=req.body;
    if(isinvalid(email) || isinvalid(password)){
        return res.status(403).json({message:'user details are not valid fill all neccessary fields',success:true});
    }
        const User=await user.findOne({where:{email:email}});
        if(User){
            bcrypt.compare(password,User.password,async(err,result)=>{
                if(err){
                    throw new Error('something went wrong');
                }if(result===true){
                    await User.update({isLogin:true});
                    res.status(201).json({message:'User logged in successfully',success:true,token:generateAccessToken(User.id,User.name,User.isLogin)})
                }else{
                    return res.status(401).json({message:' * User not Authorized',success:false});
                }
            });
        }
    else{
            return res.status(404).json({message:' * User not Found',success:false});
        }
    }catch(err){
        res.status(500).json({message:err,success:false});
}
}

exports.sync=async()=>{
    try{
        await sequelize.sync()
    }
catch(err){
        console.log(err)
    }
}