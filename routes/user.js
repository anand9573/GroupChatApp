const express=require('express');
const router=express.Router();

const middleware=require('../middleware/authenticate')

const userControllers=require('../controllers/user')

router.post('/signup',userControllers.signup)

router.post('/login',userControllers.login)

module.exports=router;