import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import TaskManager from "./pages/TaskManager";

export default function App() {
  const { user } = useAuth();
  const [page, setPage] = useState("login"); // login | signup | dashboard | tasks

  if (!user && page === "login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <Login onSwitch={() => setPage("signup")} />
        </div>
      </div>
    );
  }

  if (!user && page === "signup") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <Signup onSwitch={() => setPage("login")} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar onNavigate={setPage} />
      <main className="max-w-5xl mx-auto p-4">
        {page === "dashboard" && <Dashboard />}
        {page === "tasks" && <TaskManager />}
      </main>
    </div>
  );
}
