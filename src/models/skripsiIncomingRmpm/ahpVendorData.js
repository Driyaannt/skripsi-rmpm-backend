const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ahpVendorData', {
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
    total_transactions: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    on_time_transactions: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total_capacity: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    avg_quality: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ahp_vendor_data',
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
        name: "ahp_vendor_data_ibfk_1",
        using: "BTREE",
        fields: [
          { name: "calculation_id" },
        ]
      },
    ]
  });
};
