const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Order", {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        rawMaterialName: {
            type: Sequelize.STRING(200),
            allowNull: false
        },
        orderDate: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        rawMaterialMass: {
            type: Sequelize.DECIMAL(10, 2).UNSIGNED,
            allowNull: false
        },
        rawMaterialPallets: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        productMass: {
            type: Sequelize.DECIMAL(10, 2).UNSIGNED,
            allowNull: true
        },
        productPallets: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: true
        },
        currentStatus: {
            type: Sequelize.INTEGER.UNSIGNED,
            min: 1,
            max: 9,
            allowNull: false
        },
    });
};