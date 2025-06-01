const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const ahpPriorityVectors = sequelize.define('ahpPriorityVectors', {
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
    vendor_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    priority_value: {
      type: DataTypes.DECIMAL(10,6),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'ahp_priority_vectors',
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
        name: "unique_pv_per_vendor_criteria",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "calculation_id" },
          { name: "criteria" },
          { name: "vendor_name" },
        ]
      },
    ]
  });

  ahpPriorityVectors.associate = function(models) {
    ahpPriorityVectors.belongsTo(models.ahpCalculations, {
      foreignKey: 'calculation_id',
      targetKey: 'id',
      as: 'calculation'
    });
  };

  return ahpPriorityVectors;
};
