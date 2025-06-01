const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const trAccessAplication = sequelize.define('trAccessAplication', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_access_aplication: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'mst_access_aplication',
        key: 'id'
      }
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'mst_user',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'tr_access_aplication',
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
        name: "FK_tr_access_aplication_mst_access_aplication",
        using: "BTREE",
        fields: [
          { name: "id_access_aplication" },
        ]
      },
      {
        name: "FK_tr_access_aplication_mst_user",
        using: "BTREE",
        fields: [
          { name: "id_user" },
        ]
      },
    ]
  });
  trAccessAplication.associate = models => {
    trAccessAplication.belongsTo(models.mstAccessAplication, { as: 'access', foreignKey: 'id_access_aplication' });
    // trAccessAplication.belongsTo(models.mstAccessAplication, { as: 'mstaccess', foreignKey: 'id' });
    trAccessAplication.belongsTo(models.mstUser, { as: 'user', foreignKey: 'id_user' });
  }

  return trAccessAplication;
};
