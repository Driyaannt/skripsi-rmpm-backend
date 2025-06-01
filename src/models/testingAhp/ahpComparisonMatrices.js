const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const ahpComparisonMatrices = sequelize.define('ahpComparisonMatrices', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    calculation_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'ahp_calculations',
        key: 'id'
      }
    },
    criteria: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    matrix_data: {
      type: DataTypes.JSON,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'ahp_comparison_matrices',
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
      {
        name: "id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "unique_criteria_per_calculation",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "calculation_id" },
          { name: "criteria" },
        ]
      },
    ]
  });

  ahpComparisonMatrices.associate = function(models) {
    ahpComparisonMatrices.belongsTo(models.ahpCalculations, {
      foreignKey: 'calculation_id',
      targetKey: 'id',
      as: 'calculation'
    });
  };
  return ahpComparisonMatrices;
};
