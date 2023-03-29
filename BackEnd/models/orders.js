const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    paymentid: {
        type: String,

    },
    orderid: {
        type: String,


    },
    status: {
        type: String,

    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }


})

module.exports = mongoose.model('order', OrderSchema);

/*const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const Order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    paymentid: Sequelize.STRING,
    orderid: Sequelize.STRING,
    status: Sequelize.STRING
})

module.exports = Order;*/