const { Model } = require("sequelize");

class User extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id:        {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
                name:      {type: DataTypes.STRING(255), index: true, allowNull: false},
                age:       {type: DataTypes.INTEGER, index: true, allowNull: false},
                address:   {type: DataTypes.STRING(255), allowNull: false},
                team:      {type: DataTypes.STRING(255), index: true, allowNull: true},
            },
            {
                // define the table's name
                tableName: 'user',
                sequelize
            }
        );
    }
}


module.exports = User;