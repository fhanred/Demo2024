const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('temperatura', {
    id:{
      type: DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true,
    },
    type:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    date:{
      type: DataTypes.STRING,
      allowNull:true,
    },
    name:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    mañana: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tarde: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },{timestamps:false});
};