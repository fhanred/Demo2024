const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('evolucion', {
    id:{
      type: DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    evolucion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    abono: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    precio:{
      type:DataTypes.INTEGER,
      allowNull:true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },{timestamps:false});
};