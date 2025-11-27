import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import TaskList from "../components/TaskList";

export default function Dashboard() {
  const { token, API_BASE, user } = useAuth();
  const [assigned, setAssigned] = useState([]);
  const [created, setCreated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${API_BASE}/tasks/my-tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAssigned(data.assignedTasks || []);
      setCreated(data.createdTasks || []);
      setLoading(false);
    };
    load();
  }, [API_BASE, token]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <section>
        <h2 className="text-lg font-semibold mb-2">
          Tasks Assigned to You
        </h2>
        <TaskList tasks={assigned} />
      </section>
      {user.role === "manager" && (
        <section>
          <h2 className="text-lg font-semibold mb-2">
            Tasks You Created
          </h2>
          <TaskList tasks={created} />
        </section>
      )}
    </div>
  );
}
