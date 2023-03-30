const ForgotPassword = require('../models/password');
const User = require('../models/user');
const uuid = require('uuid');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const sendResetPasswordMail = async (name, email, id) => {
    try {
        const transporter = await nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPassword,
            },
        });
        const mailOptions = {
            from: config.emailUser,
            to: email,
            subject: 'Reset Password',
            html: `<p> Hiii ${name}, Please copy the link and<a href=http://localhost:3000/password/resetpassword/${id}>  reset password </a>`,
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('mail has been sent', info.response);
            }
        });
    } catch (error) {
        // return res.status(400).send({ success: false, message: error.message })
        return error;
    }
};

const hashedPassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const forgotPassword = async (req, res, next) => {
    const email = req.body.mail;

    try {
        const userData = await User.findOne({ email: email });

        if (userData) {
            const id = uuid.v4();
            const data = await ForgotPassword.create({
                id: id,
                email: email,
                active: true,
            }).catch((err) => {
                console.log(err);
                throw new Error(err);
            });
            sendResetPasswordMail(userData.username, userData.email, id);

            return res
                .status(200)
                .send({ success: true, message: 'Please check your inbox and follow link to reset' });
        } else {
            return res.status(200).json({ success: true, message: 'email not found' });
        }
    } catch (error) {
        res.status(400).json({ success: false, message: 'failed' });
    }
};

const resetpassword = async (req, res) => {
    const id = req.params.id;

    try {
        const forgotpasswordrequest = await Forgot.findOne({ _id: id });
        console.log(forgotpasswordrequest);
        if (forgotpasswordrequest) {
            forgotpasswordrequest.active = false;
            await forgotpasswordrequest.save();
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
            )
            res.end()
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error' });
    }
}

const updatepassword = async (req, res) => {
    try {
        const newpassword = req.query.newpassword;
        const resetpasswordid = req.params.id;
        const resetpasswordrequest = await Forgot.findOne({ _id: resetpasswordid });
        if (resetpasswordrequest) {
            const user = await User.findOne({ _id: resetpasswordrequest.userId });
            if (user) {
                const saltRounds = 10;
                bcrypt.genSalt(saltRounds, function (err, salt) {
                    if (err) {
                        console.log(err);
                        throw new Error(err);
                    }
                    bcrypt.hash(newpassword, salt, function (err, hash) {
                        if (err) {
                            console.log(err);
                            throw new Error(err);
                        }
                        user.password = hash;
                        user.save().then(() => {
                            res.status(201).json({ message: 'Successfully update the new password' });
                        });
                    });
                });
            } else {
                res.status(404).json({ error: 'No user exists', success: false });
            }
        } else {
            res.status(404).json({ error: 'No reset password request exists', success: false });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error' });
    }
};

module.exports = {
    forgotPassword,
    resetpassword,
    updatepassword
}
