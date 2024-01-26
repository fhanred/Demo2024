const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('registro', {
    id:{
      type: DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true,
    },
    producto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    proveedor: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue:"N/A"
    },
    precio: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue:0
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    entrada:{
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue:false
    }
  },{timestamps:false});
};