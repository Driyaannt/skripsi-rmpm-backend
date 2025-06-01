const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const mstVarian=  sequelize.define('mstVarian', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    kode_material: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    nama_material: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ukuran: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'mst_varian',
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

  return mstVarian;
};
