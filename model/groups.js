const sequelize=require('../util/database');
const Sequelize=require('sequelize');

const Groups=sequelize.define('groups',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
   groupName:{
    type:Sequelize.STRING,
    allowNull:false,
    unique:true
   },
   createdBy:{
    type:Sequelize.STRING,
    allowNull:false
   }
});

module.exports=Groups;