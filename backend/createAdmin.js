
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectAdminDB from "./config/adminDB.js";
import getAdminModel from "./models/admin.js";

const createAdmin = async () => {
    let connection;

    try {
        const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

        if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
            throw new Error("Admin environment variables are missing");
        }

        if (ADMIN_PASSWORD.length < 8) {
            throw new Error("Password must be at least 8 characters");
        }

        // Connect to separate Admin Database
        connection = await connectAdminDB();

        const Admin = getAdminModel(connection);

        const email = ADMIN_EMAIL.trim().toLowerCase();

        // Check existing admin
        const existingAdmin = await Admin.findOne({ email });

        if (existingAdmin) {
            console.log("Admin account already exists.");
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

        // Create Admin
        const admin = await Admin.create({
            name: ADMIN_NAME,
            email,
            password: hashedPassword
        });

        console.log("Admin created successfully!");
        console.log("Email:", admin.email);
        console.log("Collection: admins");

    } catch (error) {
        console.error("Admin creation failed:", error.message);
        process.exitCode = 1;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

createAdmin();
