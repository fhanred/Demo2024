const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('proveedor', {
    id:{
      type: DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    rut: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:""
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    celular: {
        type: DataTypes.STRING,
        allowNull: true,
      },
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
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },

  },{timestamps:false});
};