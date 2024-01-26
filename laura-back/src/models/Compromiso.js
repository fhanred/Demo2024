const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('compromiso', {
    id:{
      type: DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true,
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    firmado: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: new Date()
    },
    menorname:{
        type: DataTypes.STRING,
        allowNull:true,
    },
    menorcedula:{
        type: DataTypes.STRING,
        allowNull:true,
    },
    profesional:{
        type: DataTypes.STRING,
        allowNull:true,
    },
    consultorio:{
        type: DataTypes.STRING,
        allowNull:true,
    }
  },{timestamps:false});
};