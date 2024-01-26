const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('procedimientos', {
    id:{
      type: DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    value:{
        type: DataTypes.INTEGER,
        allowNull: true,
    }
  },{timestamps:false});
};