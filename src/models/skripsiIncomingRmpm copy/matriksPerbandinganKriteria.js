const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  const matriksPerbandinganKriteria = sequelize.define('matriksPerbandinganKriteria', {
    id_matriks: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_kriteria_row: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'kriteria',
        key: 'id_kriteria'
      }
    },
    id_kriteria_col: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'kriteria',
        key: 'id_kriteria'
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
    tableName: 'matriks_perbandingan_kriteria',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_matriks" },
        ]
      },
      {
        name: "id_kriteria_row",
        using: "BTREE",
        fields: [
          { name: "id_kriteria_row" },
        ]
      },
      {
        name: "id_kriteria_col",
        using: "BTREE",
        fields: [
          { name: "id_kriteria_col" },
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

  matriksPerbandinganKriteria.associate = function (models) {
    matriksPerbandinganKriteria.belongsTo(models.kriteria, { foreignKey: 'id_kriteria_row' });
    matriksPerbandinganKriteria.belongsTo(models.kriteria, { foreignKey: 'id_kriteria_col' });
    matriksPerbandinganKriteria.belongsTo(models.periode, { foreignKey: 'id_periode' });
  };
  return matriksPerbandinganKriteria;
};
