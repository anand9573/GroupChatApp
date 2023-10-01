const sequelize=require('../util/database');
const user=require('../model/user');
const groupchat=require('../model/groupchat');

function isInValid(string){
    if(string===undefined || string.length===0){
        return true
    }else{
        return false
    }
}

exports.sendmsg=async(req,res,next)=>{
   let t=await sequelize.transaction();
    try{
        const {msg}=req.body;
        if(isInValid(msg)){
            return res.status(400).json({message:'Missing parameters !',success:false});
        }
        const data=await req.user.createMsgbox({msg:msg,status:'Sent'},{transaction:t});
        await t.commit();
        res.status(201).json({messages:data,success:true})

    }catch(err){
        if (t) {
            await t.rollback();
        }
        res.status(500).json({error:err,success:false}) 
    }
}

exports.usersonline=async(req,res,next)=>{
    try{
    const activeuser=await user.findAll({where:{isLogin:true}});
    const msgs=await req.user.getMsgboxes()
                console.log(msgs)
    res.status(201).json({users:activeuser,success:false,msgs:msgs});
}catch(err){
    res.status(500).json({error:err,success:false});
}
}

// Model.findAll({
//     where: {
//         createdAt: {
//             $gt: startTime,
//             $lt: endTime
//         }
//     }
// })