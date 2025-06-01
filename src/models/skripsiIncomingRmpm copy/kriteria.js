const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const kriteria =  sequelize.define('kriteria', {
    id_kriteria: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nama_kriteria: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'kriteria',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_kriteria" },
        ]
      },
    ]
  });

  return kriteria;
};
