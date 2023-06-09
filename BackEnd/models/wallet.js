const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ExpenseSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: {
        type: Number,
        required: true
    },
    detail: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true
    }



})

module.exports = mongoose.model('expenses', ExpenseSchema);

/*const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const wallet = sequelize.define('Wallet', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    amount: { type: Sequelize.INTEGER },
    detail: {
        type: Sequelize.STRING
    },
    category: {
        type: Sequelize.STRING,

    }
});
module.exports = wallet;*/