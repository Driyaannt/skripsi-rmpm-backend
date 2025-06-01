const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ahpVendorEvaluation', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    material_code: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    vendor_code: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    delivery_accuracy_score: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    capacity_score: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    price_score: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    quality_score: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    total_score: {
      type: DataTypes.FLOAT,
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
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'ahp_vendor_evaluation',
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
    ]
  });
};
