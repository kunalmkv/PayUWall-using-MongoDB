const User = require('../models/user');
const bcrypt = require('bcrypt');
function stringInvalid(str) {
    if (str == undefined || str.length == 0 || str == null)
        return true;
    else return false;
}
exports.postAddUser = async (req, res, next) => {
    try {
        const userID = req.body.newID;
        const mail = req.body.mail;
        const password = req.body.pw;
        if (stringInvalid(userID) || stringInvalid(password) || stringInvalid(mail)) {
            return res.status(400).json({ err: "Missing input parameters" })
        }
        const existingUser = await User.findOne({ email: mail });
        if (existingUser) {
            return res.status(207).json({ message: "Email Already Exists!" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            userName: userID,
            email: mail,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).json({ message: 'Successfully created new user' });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Oopss! Something went wrong'
        })
    }
}
