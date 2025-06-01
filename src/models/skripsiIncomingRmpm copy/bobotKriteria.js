const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const bobotKriteria = sequelize.define('bobotKriteria', {
    id_bobot: {
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
    id_periode: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'periode',
        key: 'id_periode'
      }
    },
    bobot: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'bobot_kriteria',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_bobot" },
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
        name: "id_periode",
        using: "BTREE",
        fields: [
          { name: "id_periode" },
        ]
      },
    ]
  });

  bobotKriteria.associate = function(models) {
    bobotKriteria.belongsTo(models.kriteria, {
      foreignKey: 'id_kriteria',
      targetKey: 'id_kriteria'
    });
    bobotKriteria.belongsTo(models.periode, {
      foreignKey: 'id_periode',
      targetKey: 'id_periode'
    });
  };
  return bobotKriteria;
};
