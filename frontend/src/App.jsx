import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";

// Read the saved session (if any) so a page refresh keeps the user logged in
const getStoredUser = () => {
  try {
    const token = sessionStorage.getItem("token");
    const user = JSON.parse(sessionStorage.getItem("user"));
    return token && user ? user : null;
  } catch {
    return null;
  }
};

export default function App() {
  const [user, setUser] = useState(getStoredUser);
  const [page, setPage] = useState("login");

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setUser(null);
    setPage("login");
  };

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return page === "login" ? (
    <Login
      onSwitch={() => setPage("register")}
      onLogin={(loggedInUser) => setUser(loggedInUser)}
    />
  ) : (
    <Register onSwitch={() => setPage("login")} />
  );
}
