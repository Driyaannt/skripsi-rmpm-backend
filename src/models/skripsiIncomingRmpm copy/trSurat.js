const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const trSurat = sequelize.define('trSurat', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    pengiriman_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'trPengiriman',
        key: 'id'
      }
    },
    no_sj: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    no_po: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    tgl_sj: {
      type: DataTypes.DATE,
      allowNull: true
    },
    jumlah_muatan: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nama_material:{
      type: DataTypes.STRING(50),
      allowNull: true
    },
    nama_suplier: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    nama_manufacture:{
      type: DataTypes.STRING(50),
      allowNull: true
    },
    lot_number: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    satuan: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    keterangan_kirim: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    abnormal:{
      type: DataTypes.STRING(50),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tr_surat',
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

  trSurat.associate = function(models) {
    trSurat.belongsTo(models.trPengiriman, { foreignKey: 'pengiriman_id', as: 'pengiriman' });
  };

  return trSurat;
};
