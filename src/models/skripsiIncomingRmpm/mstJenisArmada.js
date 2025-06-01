const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mstJenisArmada', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    location: {
      type: DataTypes.ENUM('Sukabumi','Kejayan'),
      allowNull: true,
      defaultValue: "Kejayan"
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nama_armada: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'mst_jenis_armada',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
