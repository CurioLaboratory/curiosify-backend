require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../../models/auth/User");
const redisClient =require("../../redisclient")
exports.signup = async (req, res) => {
    try {
        const { name, email, password, role, collegeName } = req.body;

        // Restricted domains (update this list with the domains you want to restrict)
        const restrictedDomains = ['gmx.fr']; // Add any domains you want to restrict

        // Extract the domain from the email
        const emailDomain = email.split('@')[1];

        // Check if the email domain is restricted
        if (restrictedDomains.includes(emailDomain)) {
            return res.status(400).json({
                success: false,
                message: `Email registration from ${emailDomain} is not allowed.`,
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "A user with this email already exists.",
            });
        }

        const rollNo = role === "student" ? req.body.rollNo : undefined;
        const classLevel = role === "student" ? req.body.classLevel : undefined;
        const emailToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Store user details temporarily in Redis
        await redisClient.setEx(email, 3600, JSON.stringify({
            role, name, email, password, rollNo, classLevel, collegeName, emailToken
        }));

        // If the email domain is not restricted, proceed to send the verification email
        const transporter = nodemailer.createTransport({
            host: process.env.SES_HOST,
            port: process.env.SES_PORT,
            auth: {
                user: process.env.SES_USER,
                pass: process.env.SES_PASS,
            },
            secure: true, // Use true for SSL (port 465)
            tls: {
                rejectUnauthorized: false, // Optional: disable certificate validation (useful for development)
            },
        });

        const baseUrl = process.env.FRONTEND_URL;
        const verificationUrl = `${baseUrl}/verify-email?token=${emailToken}`;

        const mailOptions = {
            from: '"Curiosify" <business@curiosify.in>',
            to: email,
            subject: 'Verify your email',
            html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email address.</p>`,
        };
        // Send email
        await transporter.sendMail(mailOptions);
        return res.status(200).json({
            success: true,
            message: "Registration successful! Please check your email to verify your account.",
            token: emailToken,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to register user!",
        });
    }
};



exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const user = await User.findOne({ email }).select(
            "email name hashedPwd role salt rollNo classLevel collegeName"
        );

        if (!user) {
            res.status(500).json({
                success: false,
                message: "User not found!",
            });
        } else if (user.role !== role) {
            res.status(500).json({
                success: false,
                message: "Incorrect Role!"
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

                // console.log(user);

                res.status(200).json({
                    success: true,
                    token,
                    user: {
                        id: user._id,
                        role: user.role,
                        name: user.name,
                        email: user.email,
                        collegeName:user.collegeName,
                        rollNo:
                            user.role === "student" ? user.rollNo : undefined,
                        classLevel:
                            user.role ==='student'? user.classLevel:  undefined, 
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


exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;
        // Decode token to get email
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(400).json({ success: false, message: "Token has expired. Please request a new verification email." });
            }
            return res.status(400).json({ success: false, message: "Invalid token." });
        }

        const email = decoded.email;
        // Retrieve user data from Redis
        const userData = await redisClient.get(email);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User data not found or expired." });
        }

        const parsedUserData = JSON.parse(userData);

        // Check if the user already exists in the database
        const existingUser = await User.findOne({ email: parsedUserData.email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already registered." });
        }

        // Hash the password before saving to the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(parsedUserData.password, salt);

        // Create new user object
        const newUser = new User({
            role: parsedUserData.role,
            name: parsedUserData.name,
            email: parsedUserData.email,
            collegeName:parsedUserData.collegeName,
            hashedPwd: hashedPassword,
            rollNo: parsedUserData.rollNo,
            classLevel:parsedUserData.classLevel,
            salt: salt,
            isVerified:true,
        });

        // Save the verified user to the database
        await newUser.save();

        // Remove user data from Redis after successful verification
        await redisClient.del(email);

        res.status(200).json({
            success: true,
            message: "Email verified successfully! You can now log in.",
            role:newUser.role,
        });

    } catch (error) {
        console.error("Error during email verification:", error);
        res.status(500).json({
            success: false,
            message: "Email verification failed.",
        });
    }
};
