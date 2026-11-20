import { useState, useEffect } from "react";

import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import StyleProfile from "./StyleProfile";
import WardrobePreview from "./Wardrobe";
import RecommendationsView from "./components/RecommendationsView";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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
      const response = await fetch(`${API_URL}/style-profile/status`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to check profile status");
      }

      const data = await response.json();

      setPage(data.completed ? "userDashboard" : "styleProfile");
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

  // Navigation Helper
  const navigateTo = (destinationPage) => {
    setPage(destinationPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Checking Profile Loading Screen
  if (page === "checkingProfile") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F3EE] text-[#292526]">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#452C3A] text-xl font-bold text-[#F7F3EE] shadow-md animate-pulse">
          OM
        </div>
        <div className="mt-6 font-serif-editorial text-2xl font-bold text-[#452C3A]">
          OUTFITMUSE
        </div>
        <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-[#84917C]">
          Harmonizing your digital salon...
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
  if (page === "login") {
    return (
      <Login
        onSwitch={() => setPage("register")}
        onLogin={handleUserLogin}
        onAdminLogin={() => setPage("adminLogin")}
      />
    );
  }

  // Initial Onboarding Style Profile (if not yet in dashboard flow)
  if (page === "styleProfile" && user && !sessionStorage.getItem("completed_profile_once")) {
    // Check if coming from within the app or onboarding
  }

  // Authenticated Member Pages (Wrapped in Consistent Navbar and Editorial Footer)
  if (user) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-[#F7F3EE] text-[#292526] selection:bg-[#452C3A] selection:text-[#F7F3EE]">
        
        {/* Consistent Reusable Navbar */}
        <Navbar
          activePage={page}
          onNavigate={navigateTo}
          onLogout={handleUserLogout}
          user={user}
          onAddClothes={() => navigateTo("wardrobe")}
        />

        {/* Dynamic Page Container */}
        <main className="mx-auto w-full max-w-7xl flex-1 px-6 lg:px-12 py-8 lg:py-12">
          
          {page === "userDashboard" && (
            <Dashboard
              user={user}
              onLogout={handleUserLogout}
              onOpenWardrobe={() => navigateTo("wardrobe")}
              onOpenRecommendations={() => navigateTo("recommendations")}
              onOpenStyleProfile={() => navigateTo("styleProfile")}
              onAddClothes={() => navigateTo("wardrobe")}
            />
          )}

          {page === "wardrobe" && (
            <WardrobePreview
              onOpenRecommendations={() => navigateTo("recommendations")}
            />
          )}

          {page === "recommendations" && (
            <RecommendationsView
              onOpenWardrobe={() => navigateTo("wardrobe")}
              onOpenStyleProfile={() => navigateTo("styleProfile")}
            />
          )}

          {page === "styleProfile" && (
            <StyleProfile
              onComplete={handleStyleProfileComplete}
              onLogout={handleUserLogout}
              onBackToDashboard={() => navigateTo("userDashboard")}
            />
          )}

        </main>

        {/* Consistent Reusable Luxury Footer */}
        <Footer
          onNavigate={navigateTo}
          variant="full"
        />

      </div>
    );
  }

  // Fallback
  return (
    <Login
      onSwitch={() => setPage("register")}
      onLogin={handleUserLogin}
      onAdminLogin={() => setPage("adminLogin")}
    />
  );
}
