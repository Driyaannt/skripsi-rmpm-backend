const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const konsistensi =  sequelize.define('konsistensi', {
    id_konsistensi: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_periode: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'periode',
        key: 'id_periode'
      }
    },
    lambda_max: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    ci: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    cr: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    is_konsisten: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'konsistensi',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_konsistensi" },
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

  konsistensi.associate = function(models) {
    konsistensi.belongsTo(models.periode, { foreignKey: 'id_periode' });
  };
  return konsistensi;
};
