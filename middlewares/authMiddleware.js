// Verify JWT token
// Check logged-in user
// Protect private routes

const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
    try {

        let token;

        // check if token exists in headers
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                message: "Not authorized, no token"
            });
        }

        const decoded = jwt.verify(token, "secretkey123");

        req.user = await User.findById(decoded.id).select("-password");

        next();

    } catch (error) {
        res.status(401).json({
            message: "Not authorized, token failed"
        });
    }
};

module.exports = { protect };