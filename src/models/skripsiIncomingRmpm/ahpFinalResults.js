const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const ahpFinalResults = sequelize.define('ahpFinalResults', {
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
    vendor_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    delivery_accuracy_score: {
      type: DataTypes.DECIMAL(10,6),
      allowNull: true
    },
    price_score: {
      type: DataTypes.DECIMAL(10,6),
      allowNull: true
    },
    capacity_score: {
      type: DataTypes.DECIMAL(10,6),
      allowNull: true
    },
    quality_score: {
      type: DataTypes.DECIMAL(10,6),
      allowNull: true
    },
    total_score: {
      type: DataTypes.DECIMAL(10,6),
      allowNull: false
    },
    ranking: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'ahp_final_results',
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
        name: "unique_vendor_per_calculation",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "calculation_id" },
          { name: "vendor_name" },
        ]
      },
    ]
  });

  ahpFinalResults.associate = function(models) {
    ahpFinalResults.belongsTo(models.ahpCalculations, {
      foreignKey: 'calculation_id',
      targetKey: 'id',
      as: 'calculation'
    });
  };
  return ahpFinalResults;
};
