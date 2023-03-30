/*const User = require('../models/user');
const Wallet = require('../models/wallet');
const sequelize = require('../util/database');
const getLeaderBoard = async (req, res) => {
    try {
        const users = await User.findAll();
        const wallet = await Wallet.findAll();
        const userAggregateExpenses = {};
        console.log(wallet);
        wallet.forEach((expense) => {
            if (userAggregateExpenses[expense.userId]) {
                userAggregateExpenses[expense.userId] = userAggregateExpenses[expense.userId] + expense.amount;
            }
            else {
                userAggregateExpenses[expense.userId] = expense.amount;
            }

        })
        var userLeaderBoardDetails = [];
        users.forEach((user) => {
            userLeaderBoardDetails.push({ name: user.userName, total_cost: userAggregateExpenses[user.id] || 0 })
        })
        userLeaderBoardDetails.sort((a, b) => {
            return b.total_cost - a.total_cost;
        })

        res.status(200).json(userLeaderBoardDetails);
    } catch (err) {
        res.status(500).json(err);
    }

}
module.exports = {
    getLeaderBoard
}*/
const User = require('../models/user');
const Wallet = require('../models/wallet');


const getLeaderBoard = async (req, res) => {
    try {
        const userWallets = await Wallet.aggregate([
            {
                $group: {
                    _id: "$userId",
                    total_cost: { $sum: "$amount" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $project: {
                    "userName": "$user.userName",
                    "total_cost": 1
                }
            },
            {
                $sort: {
                    total_cost: -1
                }
            }
        ]);
        res.status(200).json(userWallets);
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    getLeaderBoard
};
