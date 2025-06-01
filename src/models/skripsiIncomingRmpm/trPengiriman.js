const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const trPengiriman = sequelize.define('trPengiriman', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    location: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tanggal_kirim: {
      type: DataTypes.DATE,
      allowNull: true
    },
    keperluan: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    tujuan: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    alamat: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    nopol: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    nama_ekspedisi:{
      type: DataTypes.STRING(50),
      allowNull: true
    },
    jenis_kendaraan: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    no_cont: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    no_segel: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    kondisi_segel: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ketnosegel: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    display_suhu: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    nama_sopir: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    kondisiArmada: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    cek_pest_armada: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    pengganjal_roda: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    temuan_pest: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ket_kondisi_pallet: {
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
    pest_material: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    temuan_pest_pallet: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    nama_checker: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    nama_driver: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    nama_loader: {
      type: DataTypes.STRING(50),
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
    armada_masuk: {
      type: DataTypes.DATE,
      allowNull: true
    },
    armada_keluar: {
      type: DataTypes.DATE,
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
    tableName: 'tr_pengiriman',
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

  trPengiriman.associate = function(models) {
    trPengiriman.hasMany(models.trSurat, { foreignKey: 'pengiriman_id', as: 'surats' });
  };

  return trPengiriman;
};
