const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true

    },
    password: {
        type: String,
        required: true
    },
    isPremiumUser: {
        type: Boolean,
        default: false
    }


})

module.exports = mongoose.model('User', userSchema);

/*const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const users = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    userName: { type: Sequelize.STRING },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,

    },
    ispremiumuser: Sequelize.BOOLEAN
});
module.exports = users;*/