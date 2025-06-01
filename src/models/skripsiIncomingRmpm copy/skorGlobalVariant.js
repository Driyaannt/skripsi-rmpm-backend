const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const skorGlobalVariant = sequelize.define('skorGlobalVariant', {
    id_skor: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_alternatif: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'alternatif',
        key: 'id_alternatif'
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
    id_periode: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'periode',
        key: 'id_periode'
      }
    },
    skor: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    ranking: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'skor_global_variant',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_skor" },
        ]
      },
      {
        name: "id_alternatif",
        using: "BTREE",
        fields: [
          { name: "id_alternatif" },
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
        name: "id_periode",
        using: "BTREE",
        fields: [
          { name: "id_periode" },
        ]
      },
    ]
  });

  skorGlobalVariant.associate = function(models) {
    // associations can be defined here
    skorGlobalVariant.belongsTo(models.alternatif, { foreignKey: 'id_alternatif' });
    skorGlobalVariant.belongsTo(models.periode, { foreignKey: 'id_periode' });
  }
  return skorGlobalVariant;
};
