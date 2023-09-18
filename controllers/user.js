const sequelize=require('../util/database');
const user=require('../model/user');
const bcrypt=require('bcrypt');

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
                    await user.create({name,email,phone,password:hash},{transaction:t});
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

exports.sync=async()=>{
    try{
        await sequelize.sync()
    }
catch(err){
        console.log(err)
    }
}