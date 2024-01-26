const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('client', {
    id:{
      type: DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true,
    },
    saldo:{
      type:DataTypes.INTEGER,
      allowNull:true,
      defaultValue:0,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cedula: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    }
    ,
    lastname: {
      type: DataTypes.STRING,
      allowNull: true,
    }
    ,
    direccion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    departamento: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ciudad: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    celular: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nacimiento: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    especialista: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    diagrama:{
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    date:{
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    ulpro:{
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    proxci:{
      type: DataTypes.DATEONLY,
      allowNull: true,
    }
  },{timestamps:false});
};