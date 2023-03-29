const Wallet = require('../models/wallet');
const S3service = require('../services/S3services')
const UserServices = require('../services/userservices');
const DownloadHistory = require('../models/downloadHistory');

require('dotenv').config();

function stringInvalid(str) {
    if (str == undefined || str.length === 0 || str == null)
        return true;
    else return false;
}


const downlaodExpense = async (req, res) => {
    try {
        const uId = req.user.id;
        if (!req.user.ispremiumuser) {
            return res.status(401).json({ success: false, error: 'Sorry, You are not a premium User' })
        }
        const expenses = await Wallet.find({ userId: uId });
        console.log(expenses);
        const userID = req.user.id;
        const stringifiedWallet = JSON.stringify(expenses);
        const filename = `Wallet${userID}/${new Date()}.txt`;
        const fileURL = await S3service.uploadToS3(stringifiedWallet, filename);
        await DownloadHistory.create({
            userId: userID,
            downloadURL: fileURL
        })
        return res.status(201).json({ fileURL, success: true });
    } catch (error) {
        return res.status(500).json({ fileURL: '', success: false, message: error });
    }
}


const postAddExp = async (req, res, next) => {
    try {
        const { amount, detail, category } = req.body;

        if (stringInvalid(amount) || stringInvalid(detail) || stringInvalid(category)) {
            return res.status(400).json({ success: false, err: "Missing input parameters" });
        }
        const data = await new Wallet({ amount: amount, detail: detail, category: category, userId: req.user._id });
        await data.save();
        return res.status(201).json({ success: true, newExpenseDetail: data });
    } catch (err) {
        return res.status(403).json({
            success: false,
            error: err
        })
    }
}

const getExpense = async (req, res) => {
    try {
        let ITEMS_PER_PAGE = +(req.query.ITEMS_PER_PAGE) || 2;
        const page = +req.query.page || 1;
        let totalItems = await Wallet.countDocuments({ userId: req.user._id });
        console.log('>>>total items>>>', totalItems);

        const getWallet = await Wallet.find({ userId: req.user._id })
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);

        console.log(getWallet);
        return res.status(200).json({
            expense: getWallet,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            nextPage: page + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        });
    } catch (err) {
        console.log("***GET expense failed***", JSON.stringify(err));
        return res.status(402).json({
            success: false,
            error: err,
        });
    }
};
const deleteExpense = async (req, res, next) => {
    try {
        const expenseId = req.params.id;

        if (stringInvalid(expenseId)) {
            console.log('ID is missing');
            return res.status(400).json({ success: false, err: 'ID is missing' });
        }

        await Wallet.findByIdAndDelete({ _id: expenseId });
        return res.status(200).json({ success: true, message: "Deleted successfully" })
    } catch (err) {
        console.log('***DELETE failed***', JSON.stringify(err));
        res.status(500).json({
            success: false,
            error: err,
            message: 'deletion failed'
        });
    }
}


const editExpense = async (req, res, next) => {
    try {
        if (!req.params.id) {
            console.log('ID is missing');
            return res.status(400).json({ err: 'ID is missing' });
        }

        const uId = req.params.id;
        const updatedAmount = req.body.amount;
        const updatedDetail = req.body.detail;
        const updatedCategory = req.body.category;

        const updatedExpense = await Wallet.findOneAndUpdate(
            { _id: uId },
            { $set: { amount: updatedAmount, detail: updatedDetail, category: updatedCategory } },
            { new: true }
        );

        res.status(201).json({ newExpenseDetail: updatedExpense });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
}

const downloadHistory = async (req, res) => {
    const uID = req.user.id;
    try {
        const downloadHistory = await DownloadHistory.find({ userId: uID });
        return res.status(200).json({ success: true, downloadHistory });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: err,
            message: 'failed to retrieve download history'
        });
    }
}


module.exports = {
    downlaodExpense,
    downloadHistory,
    postAddExp,
    getExpense,
    deleteExpense,
    editExpense
}