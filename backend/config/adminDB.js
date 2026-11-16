
import mongoose from "mongoose";

let adminConnection;

const connectAdminDB = async () => {
    try {
        if (adminConnection) {
            return adminConnection;
        }

        adminConnection = await mongoose
            .createConnection(process.env.ADMIN_MONGO_URI)
            .asPromise();

        console.log("Admin Database Connected Successfully!");

        return adminConnection;

    } catch (error) {
        console.error("Admin Database Connection Failed:", error.message);
        throw error;
    }
};

export default connectAdminDB;
