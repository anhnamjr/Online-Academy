const database = require('../database')
const sequelize = require('sequelize')

const Administrator = database.define('Administrator', {
        id: {
            primaryKey: true,
            type: sequelize.INTEGER,
            autoIncrement: true,
        },
        user_id: {
            type: sequelize.INTEGER,
            notNull: true,
        },
    },
    {
        timestamps: false,
        paranoid: true,
        tableName: 'administrator',
    }
)

module.exports = Administrator
