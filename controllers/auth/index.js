require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/auth/User");

exports.signup = async (req, res) => {
    try {
        const userData = req.body;
        const existingUser = await User.findOne({ email: userData.email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "A user with this email already exists.",
            });
        }
        const rollNo =
            userData.role === "student" ? userData.rollNo : undefined;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        const newUser = new User({
            role: userData.role,
            name: userData.name,
            email: userData.email,
            hashedPwd: hashedPassword,
            rollNo: rollNo,
            salt,
        });
        await newUser.save();
        res.status(201).json({
            success: true,
            user: {
                id: newUser._id,
                role: newUser.role,
                name: newUser.name,
                email: newUser.email,
                rollNo: newUser.role === "student" ? newUser.rollNo : undefined,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to register user!",
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select(
            "email hashedPwd role salt"
        );

        if (!user) {
            res.status(203).json({
                success: false,
                message: "User not found!",
            });
        } else {
            const hashedPwd = await bcrypt.hash(password, user.salt);
            const passwordMatch = hashedPwd === user.hashedPwd;
            if (!passwordMatch) {
                return res.status(203).json({
                    success: false,
                    message: "Incorrect password!",
                });
            } else {
                const token = jwt.sign(
                    {
                        id: user._id.toString(),
                        email: user.email,
                        role: user.role,
                    },
                    process.env.JWT_SECRET,
                    // { expiresIn: process.env.JWT_EXPIRES_IN }
                );

                res.status(200).json({
                    success: true,
                    token,
                    user: {
                        id: user._id,
                        role: user.role,
                        name: user.name,
                        email: user.email,
                        rollNo:
                            user.role === "student" ? user.rollNo : undefined,
                    },
                });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to login!",
        });
    }
};

exports.getuserdetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        res.status(200).json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Internal Server Error---");
    }
}