
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    try {
        // Get token from request header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const token = authHeader.split(" ")[1];

        // Verify JWT Token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Allow only regular users
        if (decoded.role !== "user") {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        // Store authenticated user information
        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

export default authMiddleware;
