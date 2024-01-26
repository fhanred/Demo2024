const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('inventario', {
    id:{
      type: DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    codigo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    proveedor: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      sede: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      alerta: { 
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      costo:{
        type: DataTypes.INTEGER,
        allowNull: true,
      }
  },{timestamps:false});
};