const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        console.log("AUTH HEADER:", authHeader);

        if (!authHeader) {
            return res.status(401).json({
                message: "Authorization header missing"
            });
        }

        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;

        console.log("TOKEN:", token);

        const decoded = jwt.verify(
            token,
            "borrowly_secret_key"
        );

        console.log("DECODED:", decoded);

        req.userId = decoded.userId;
        req.email = decoded.email;
        req.role = decoded.role;

        next();

    } catch (error) {
        console.log("JWT ERROR:", error.message);

        return res.status(401).json({
            message: "Invalid or expired token",
            error: error.message
        });
    }
};

module.exports = authMiddleware;