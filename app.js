const express=require('express');
const cors=require('cors')
const dotenv=require('dotenv')
dotenv.config()
const app=express();

const userRoutes=require('./routes/user')

const userControllers=require('./controllers/user')
app.use(cors({
    origin:'http://127.0.0.1:5501', //* for all
    methods:['GET','POST','DELETE','PUT'],
    credentials:true
}))
app.use(express.json())
app.use('/user',userRoutes)
userControllers.sync()
app.listen(3000)