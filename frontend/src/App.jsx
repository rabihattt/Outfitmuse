import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

export default function App() {
  const [page, setPage] = useState("login");

  return page === "login" ? (
    <Login onSwitch={() => setPage("register")} />
  ) : (
    <Register onSwitch={() => setPage("login")} />
  );
}
