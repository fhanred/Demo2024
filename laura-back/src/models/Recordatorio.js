const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('recordatorio', {
    id:{
      type: DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true,
    },
    recuerda: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dia:{
      type: DataTypes.INTEGER,
      primaryKey:true,
    }
  },{timestamps:false});
};

