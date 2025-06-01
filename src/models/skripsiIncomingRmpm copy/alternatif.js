const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const alternatif = sequelize.define('alternatif', {
    id_alternatif: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_varian: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'mst_varian',
        key: 'id'
      }
    },
    nama_alternatif: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    harga: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    kapasitas: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'alternatif',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_alternatif" },
        ]
      },
      {
        name: "id_varian",
        using: "BTREE",
        fields: [
          { name: "id_varian" },
        ]
      },
    ]
  });

  alternatif.associate = function (models) {
    alternatif.belongsTo(models.mstvarian, {
      foreignKey: 'id_varian',
      targetKey: 'id',
      as: 'varian' // ✅ Sesuaikan dengan include di controller
    });
  };

  return alternatif;
};
