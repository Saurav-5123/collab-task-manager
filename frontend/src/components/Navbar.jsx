import { useAuth } from "../hooks/useAuth";

export default function Navbar({ onNavigate }) {
  const { user, logout, dark, setDark } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-800 shadow mb-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between p-4">
        <div
          className="font-semibold text-lg cursor-pointer"
          onClick={() => onNavigate("dashboard")}
        >
          Collaborative Task Manager
        </div>
        <div className="flex items-center gap-3">
          <button
            className="text-xs px-3 py-1 rounded-full border dark:border-gray-600"
            onClick={() => setDark(!dark)}
          >
            {dark ? "Light" : "Dark"} mode
          </button>
          {user && (
            <>
              <span className="text-xs">
                {user.name} ({user.role})
              </span>
              <button
                className="text-xs px-3 py-1 bg-red-500 text-white rounded-full"
                onClick={logout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
