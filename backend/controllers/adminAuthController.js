

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectAdminDB from "../config/adminDB.js";
import getAdminModel from "../models/admin.js";

export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Connect to Admin Database
        const connection = await connectAdminDB();
        const Admin = getAdminModel(connection);

        // Find Admin
        const admin = await Admin.findOne({
            email: email.trim().toLowerCase()
        }).select("+password");

        if (!admin) {
            return res.status(401).json({
                message: "Invalid admin email or password"
            });
        }

        // Verify Password
        const isMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid admin email or password"
            });
        }

        // Generate Admin Token
        const token = jwt.sign(
            {
                id: admin._id,
                role: "admin"
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            message: "Admin login successful",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Admin login failed",
            error: error.message
        });
    }
};
