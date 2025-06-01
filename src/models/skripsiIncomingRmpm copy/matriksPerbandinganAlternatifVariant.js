const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const matriksPerbandinganAlternatifVariant= sequelize.define('matriksPerbandinganAlternatifVariant', {
    id_matriks_alt: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_kriteria: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'kriteria',
        key: 'id_kriteria'
      }
    },
    id_variant: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'variant_carton',
        key: 'id_variant'
      }
    },
    id_alternatif_row: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'alternatif',
        key: 'id_alternatif'
      }
    },
    id_alternatif_col: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'alternatif',
        key: 'id_alternatif'
      }
    },
    id_periode: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'periode',
        key: 'id_periode'
      }
    },
    nilai_perbandingan: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    nilai_normalisasi: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'matriks_perbandingan_alternatif_variant',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_matriks_alt" },
        ]
      },
      {
        name: "id_kriteria",
        using: "BTREE",
        fields: [
          { name: "id_kriteria" },
        ]
      },
      {
        name: "id_variant",
        using: "BTREE",
        fields: [
          { name: "id_variant" },
        ]
      },
      {
        name: "id_alternatif_row",
        using: "BTREE",
        fields: [
          { name: "id_alternatif_row" },
        ]
      },
      {
        name: "id_alternatif_col",
        using: "BTREE",
        fields: [
          { name: "id_alternatif_col" },
        ]
      },
      {
        name: "id_periode",
        using: "BTREE",
        fields: [
          { name: "id_periode" },
        ]
      },
    ]
  });

  matriksPerbandinganAlternatifVariant.associate = function(models) {
    matriksPerbandinganAlternatifVariant.belongsTo(models.kriteria, {
      foreignKey: 'id_kriteria',
      targetKey: 'id_kriteria'
    });
    matriksPerbandinganAlternatifVariant.belongsTo(models.alternatif, {
      foreignKey: 'id_alternatif_col',
      targetKey: 'id_alternatif'
    });
    matriksPerbandinganAlternatifVariant.belongsTo(models.periode, {
      foreignKey: 'id_periode',
      targetKey: 'id_periode'
    });
  };
  return matriksPerbandinganAlternatifVariant;
};
