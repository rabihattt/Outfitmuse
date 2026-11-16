
import { useState, useEffect } from "react";

import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import StyleProfile from "./StyleProfile";

const API_URL = "http://localhost:5000/api";

// Restore User Session
const getStoredUser = () => {
    try {
        const token = sessionStorage.getItem("token");
        const user = JSON.parse(sessionStorage.getItem("user"));

        return token && user ? user : null;
    } catch {
        return null;
    }
};

// Restore Admin Session
const getStoredAdmin = () => {
    try {
        const token = sessionStorage.getItem("adminToken");
        const admin = JSON.parse(sessionStorage.getItem("admin"));

        return token && admin ? admin : null;
    } catch {
        return null;
    }
};

export default function App() {
    const [user, setUser] = useState(getStoredUser);
    const [admin, setAdmin] = useState(getStoredAdmin);

    const [page, setPage] = useState(() => {
        if (sessionStorage.getItem("adminToken")) {
            return "adminDashboard";
        }

        if (sessionStorage.getItem("token")) {
            return "checkingProfile";
        }

        return "login";
    });

    // Check User Style Profile Status
    const checkProfileStatus = async () => {
        const token = sessionStorage.getItem("token");

        try {
            const response = await fetch(
                `${API_URL}/style-profile/status`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to check profile status");
            }

            const data = await response.json();

            setPage(
                data.completed
                    ? "userDashboard"
                    : "styleProfile"
            );

        } catch (error) {
            console.error("Profile status error:", error);
            setPage("userDashboard");
        }
    };

    // Restore User Profile Status on Page Refresh
    useEffect(() => {
        if (sessionStorage.getItem("adminToken")) {
            return;
        }

        if (sessionStorage.getItem("token")) {
            checkProfileStatus();
        }
    }, []);

    // User Logout
    const handleUserLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        setUser(null);
        setPage("login");
    };

    // Admin Logout
    const handleAdminLogout = () => {
        sessionStorage.removeItem("adminToken");
        sessionStorage.removeItem("admin");

        setAdmin(null);
        setPage("login");
    };

    // Admin Login Success
    const handleAdminLogin = (loggedInAdmin) => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        setUser(null);
        setAdmin(loggedInAdmin);
        setPage("adminDashboard");
    };

    // User Login Success
    const handleUserLogin = async (loggedInUser) => {
        sessionStorage.removeItem("adminToken");
        sessionStorage.removeItem("admin");

        setAdmin(null);
        setUser(loggedInUser);
        setPage("checkingProfile");

        await checkProfileStatus();
    };

    // Style Profile Completion
    const handleStyleProfileComplete = () => {
        setPage("userDashboard");
    };

    // User Dashboard
    if (page === "userDashboard" && user) {
        return (
            <Dashboard
                user={user}
                onLogout={handleUserLogout}
            />
        );
    }

    // Style Profile Questionnaire
    if (page === "styleProfile" && user) {
        return (
            <StyleProfile
                onComplete={handleStyleProfileComplete}
                onLogout={handleUserLogout}
            />
        );
    }

    // Checking Profile Status
    if (page === "checkingProfile") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">
                    Loading your profile...
                </p>
            </div>
        );
    }

    // Admin Dashboard
    if (page === "adminDashboard" && admin) {
        return (
            <AdminDashboard
                admin={admin}
                onLogout={handleAdminLogout}
            />
        );
    }

    // Admin Login Page
    if (page === "adminLogin") {
        return (
            <AdminLogin
                onBack={() => setPage("login")}
                onLogin={handleAdminLogin}
            />
        );
    }

    // Registration Page
    if (page === "register") {
        return (
            <Register
                onSwitch={() => setPage("login")}
            />
        );
    }

    // User Login Page
    return (
        <Login
            onSwitch={() => setPage("register")}
            onLogin={handleUserLogin}
            onAdminLogin={() => setPage("adminLogin")}
        />
    );
}
