
import { useState } from "react";

import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

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
            return "userDashboard";
        }

        return "login";
    });

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
        // Clear any previous user session
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        setUser(null);

        setAdmin(loggedInAdmin);
        setPage("adminDashboard");
    };

    // User Login Success
    const handleUserLogin = (loggedInUser) => {
        // Clear any previous admin session
        sessionStorage.removeItem("adminToken");
        sessionStorage.removeItem("admin");
        setAdmin(null);

        setUser(loggedInUser);
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
