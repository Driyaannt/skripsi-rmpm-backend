const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const user = sequelize.define('mstUser', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    // id_access: {
    //   type: DataTypes.STRING(50),
    //   allowNull: true
    // },
    nik: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    nama: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    perusahaan:{
      type: DataTypes.STRING(50),
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    jabatan:{
      type: DataTypes.STRING(50),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status:{
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'mst_user',
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

  user.associate = function(models) {
    user.hasMany(models.trAccessAplication, { foreignKey: 'id_user', as: 'mstAccess' });
  };


  return user;
};
