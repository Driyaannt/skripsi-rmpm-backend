const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const mstAccess = sequelize.define('mstAccessAplication', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name_aplication: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'mst_access_aplication',
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
  mstAccess.associate = models => {
    mstAccess.belongsTo(models.trAccessAplication, { as: 'access', foreignKey: 'id' });
   }
  return mstAccess;
};
