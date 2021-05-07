const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("User", {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },

        name: {
            type: Sequelize.STRING(100),
            allowNull: false
        },

        password: {
            type: Sequelize.STRING(200),
            allowNull: false
        },

        firstName: {
            type: Sequelize.STRING(200),
            allowNull: false
        },

        lastName: {
            type: Sequelize.STRING(200),
            allowNull: false
        },

        companyName: {
            type: Sequelize.STRING(200),
            allowNull: true
        },

        nip: {
            type: Sequelize.DECIMAL(10, 0).UNSIGNED,
            allowNull: true
        },

        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        }
    }, {
        hooks: {
            // hashowanie hasła przed zapisem do bazy
            beforeSave: async function(user, options) {
                if (user.changed('password')) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            }
        }
    });
};