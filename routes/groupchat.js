const express=require('express');
const router=express.Router();

const userAuthentication=require('../middleware/authenticate')

const chatController=require('../controllers/groupchat')

router.post('/groupchat',userAuthentication.authentication,chatController.sendmsg);

router.get('/active-users',userAuthentication.authentication,chatController.usersonline);

router.get('/getmsgs/:lastmsgid',userAuthentication.authentication,chatController.recentmsg);

module.exports=router;