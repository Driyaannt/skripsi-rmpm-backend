const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('trKedatangan', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    tanggal_terima: {
      type: DataTypes.DATE,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tujuan_pesanan: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    nopol: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    nama_ekspedisi: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    jenis_kendaraan: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    no_container: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    no_segel: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    kondisi_segel: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    ket_kondisi_segel: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    nama_sopir: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    kondisi_armada: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    pengganjal_roda: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    cek_pest_armada: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    temuan_pest_armada: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    pengiriman_pallet: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    kondisi_pallet: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ket_kondisi_pallet: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    cek_pest_material: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    temuan_pest_material: {
      type: DataTypes.STRING(50),
      allowNull: true
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
    nama_suplier: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    nama_material: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    nama_variant: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    jumlah_dikirim: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    jumlah_diterima: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    jumlah_ditolak: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    batch_number: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    satuan: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    abnormal: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    nama_checker: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    nama_driver_forklif: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    nama_loader: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    armada_masuk: {
      type: DataTypes.DATE,
      allowNull: true
    },
    armada_keluar: {
      type: DataTypes.DATE,
      allowNull: true
    },
    diisi_oleh: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    verifier: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    terlambat: {
      type: DataTypes.FLOAT,
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
    tableName: 'tr_kedatangan',
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
