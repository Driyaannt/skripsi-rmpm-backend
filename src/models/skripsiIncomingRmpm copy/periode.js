const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const periode = sequelize.define('periode', {
    id_periode: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nama_periode: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    tanggal_mulai: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    tanggal_selesai: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    jenis_periode: {
      type: DataTypes.ENUM('Bulan','Tahun'),
      allowNull: false
    },
    tahun: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'periode',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_periode" },
        ]
      },
    ]
  });

  return periode;
};
