const sequelize=require('../util/database');
const Sequelize=require('sequelize');

const Groupchat=sequelize.define('msgbox',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
   msg:Sequelize.STRING,
   status:Sequelize.STRING
});

module.exports=Groupchat;