const express=require('express');
const cors=require('cors')
const dotenv=require('dotenv')
dotenv.config()
const app=express();

const userRoutes=require('./routes/user')
const groupchatRoutes=require('./routes/groupchat')

const userControllers=require('./controllers/user');
const User = require('./model/user');
const Groupchat=require('./model/groupchat');

app.use(cors({
    origin:'http://127.0.0.1:5500', //* for all
    methods:['GET','POST','DELETE','PUT'],
    credentials:true
}))
app.use(express.json())
app.use('/user',userRoutes)
app.use('/msgbox',groupchatRoutes)

User.hasMany(Groupchat);
Groupchat.belongsTo(User);

userControllers.sync()
app.listen(3000)