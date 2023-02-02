const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports= (sequelize) => {
  // defino el modelo
  sequelize.define('recipe', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      allowNull: false,
      primaryKey: true
    },
    summary:{
      type:DataTypes.TEXT,
      allowNull: false,
    },
    health_score:{
      type:DataTypes.INTEGER,
      
    },
    steps:{
      type:DataTypes.TEXT,
      allowNull:false
    },
    stock:{
      type:DataTypes.INTEGER
    },
    img:{
      type:DataTypes.STRING(50),
      defaultValue:"https://i.gifer.com/9BYc.gif"
    }
  },  {
    timestamps: false,
  });
};
