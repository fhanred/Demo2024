const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('user', {
    id:{
      type: DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:"https://us.123rf.com/450wm/salamatik/salamatik1801/salamatik180100019/92979836-perfil-an%C3%B3nimo-icono-de-la-cara-persona-silueta-gris-avatar-masculino-por-defecto-foto-de.jpg"
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastname:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    email:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    password:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    sede:{
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue:null
    },
    comision:{
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue:0
    },
    date:{
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    especialidad:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    comisionado:{
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue:0
    }
  },{timestamps:false});
};