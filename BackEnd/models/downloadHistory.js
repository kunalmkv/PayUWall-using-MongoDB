const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DownloadurlSchema = new Schema({
    filename: {
        type: String,
        required: true
    },
    fileurl: {
        type: String,
        required: true,

    },

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }

})

module.exports = mongoose.model('downloadurl', DownloadurlSchema);

/*const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const downloadHistoryTable = sequelize.define('downloads', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    userId: Sequelize.STRING,
    downloadURL: Sequelize.STRING
})

module.exports = downloadHistoryTable;*/