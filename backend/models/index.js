const fs        = require('fs'),
      path      = require('path'),
      Sequelize = require('sequelize'),
      db        = {};

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host:    process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
    define:  {
        underscored:     false,
        //prevent sequelize from pluralizing table names
        freezeTableName: true
    }
});

fs
    .readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .forEach(function (file) {
        let model = require(path.join(__dirname, file));

        if (typeof model.init === 'function') {
            db[model.name] = model.init(sequelize, Sequelize.DataTypes);
        } else {
            db[model.name] = model(sequelize, Sequelize.DataTypes);
        }
    });

Object.keys(db).forEach(function (modelName) {
    if (typeof db[modelName].associate === 'function') {
        db[modelName].associate(db);
    } else if (typeof db[modelName].options.associate === 'function') {
        db[modelName].options.associate(db);
    }
});

module.exports = { sequelize, Sequelize };