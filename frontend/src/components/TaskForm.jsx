import { useState } from "react";

export default function TaskForm({ onSubmit }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    status: "todo",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.assignedTo) return;
    onSubmit(form);
    setForm({ title: "", description: "", assignedTo: "", status: "todo" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-sm">
      <div className="grid gap-2 md:grid-cols-2">
        <input
          name="title"
          placeholder="Task title"
          value={form.title}
          onChange={handleChange}
          className="border rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
          required
        />
        <input
          name="assignedTo"
          placeholder="AssignedTo User ID"
          value={form.assignedTo}
          onChange={handleChange}
          className="border rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
          required
        />
      </div>
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
      />
      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="border rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
      >
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <button
        type="submit"
        className="block bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create Task
      </button>
    </form>
  );
}
