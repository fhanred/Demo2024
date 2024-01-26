const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('financiero', {
    id:{
      type: DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    monto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reason:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    tipo: {
      type: DataTypes.STRING,
      // allowNull: true,
    },
    comprobante:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    categoria:{
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:" "
    },
    atendio:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    factura:{
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    sede:{
      type: DataTypes.STRING,
      allowNull: true,
    }
  },{timestamps:false});
};