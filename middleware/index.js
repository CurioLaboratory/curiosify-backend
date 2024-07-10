const jwt = require('jsonwebtoken');
require("dotenv").config();

const fetchuser = (req, res, next) => {
    const token = req.header('authToken');
    if (!token) {
        return res.status(401).json({ error: "Enter the Valid Athentication" });
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data;
        next();
    } catch (error) {
        console.error(error.message);
        return res.status(401).json({ error });
    }
}

module.exports = { fetchuser };