const Razorpay = require('razorpay');
const Order = require('../models/orders');
const existingUserController = require('./existingUser')
const User = require('../models/user');

const purchasepremium = async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: 'rzp_test_IqnaCU2K3ujIhA',
            key_secret: '3BXi8wvAsFr7YuA4Ol0XHMOT'
        })
        const amount = 2500;
        rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }
            try {
                const newOrder = new Order({ orderid: order.id, status: 'PENDING', user: req.user._id })
                await newOrder.save();
                return res.status(201).json({ order, key_id: rzp.key_id });
            } catch (error) {
                throw new Error(error);
            }
        })
    } catch (err) {
        console.log(err);
        res.status(403).json({ error: err, message: 'Something went wrong' })
    }
}

const updateTransactionStatus = async (req, res) => {
    try {
        const userId = req.user._id;
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({ orderid: order_id })
        const user = await User.findById(userId)
        const promise1 = order.updateOne({ paymentid: payment_id, status: 'SUCCESSFUL' })
        const promise2 = user.updateOne({ ispremiumuser: true })

        Promise.all([promise1, promise2]).then(() => {
            return res.status(202).json({ sucess: true, message: "Transaction Successful", token: existingUserController.generateAccessToken(userId, undefined, true) });
        }).catch((error) => {
            throw new Error(error)
        })

    } catch (err) {
        console.log(err);
        res.status(403).json({ errpr: err, message: 'Something went wrong' })

    }
}

module.exports = {
    purchasepremium,
    updateTransactionStatus
}
