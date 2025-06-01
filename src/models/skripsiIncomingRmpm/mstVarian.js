module.exports = function(sequelize, DataTypes) {
  const mstvarian = sequelize.define('mstvarian', {
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
        fields: [{ name: "id" }]
      }
    ]
  });

  mstvarian.associate = function(models) {
    mstvarian.hasMany(models.alternatif, {
      foreignKey: 'id_varian',
      sourceKey: 'id',
      as: 'alternatif'
    });
  }

  return mstvarian;
};
