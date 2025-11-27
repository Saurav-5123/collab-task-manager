import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Signup({ onSwitch }) {
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup(form);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4 text-center">Sign Up</h1>
      {error && <div className="mb-3 text-sm text-red-500">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
          placeholder="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
          placeholder="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
          placeholder="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="user">User</option>
          <option value="manager">Manager</option>
        </select>
        <button
          type="submit"
          className="w-full bg-green-600 text-white rounded px-3 py-2"
        >
          Create Account
        </button>
      </form>
      <p className="mt-3 text-sm text-center">
        Already have an account?{" "}
        <button type="button" className="text-blue-600" onClick={onSwitch}>
          Login
        </button>
      </p>
    </div>
  );
}
