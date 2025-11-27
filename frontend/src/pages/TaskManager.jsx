import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import TaskForm from "../components/TaskForm";

export default function TaskManager() {
  const { user, token, API_BASE } = useAuth();
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const res = await fetch(`${API_BASE}/tasks/my-tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTasks([...(data.assignedTasks || []), ...(data.createdTasks || [])]);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId, status) => {
    await fetch(`${API_BASE}/tasks/${taskId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    fetchTasks();
  };

  const handleNewTask = async (payload) => {
    await fetch(`${API_BASE}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    fetchTasks();
  };

  const handleDelete = async (taskId) => {
    await fetch(`${API_BASE}/tasks/${taskId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTasks();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Task Management</h1>

      {user.role === "manager" && (
        <section>
          <h2 className="text-lg font-semibold mb-2">Create New Task</h2>
          <TaskForm onSubmit={handleNewTask} />
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold mb-2">
          All Your Related Tasks
        </h2>
        {tasks.length === 0 ? (
          <div className="text-sm text-gray-500">No tasks yet.</div>
        ) : (
          <div className="grid gap-3">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 text-sm"
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="font-semibold">{task.title}</div>
                  <div className="flex gap-2 items-center">
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(task._id, e.target.value)
                      }
                      className="text-xs border rounded px-2 py-1 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    {user.id === task.createdBy?._id && (
                      <button
                        className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => handleDelete(task._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
                {task.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {task.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
