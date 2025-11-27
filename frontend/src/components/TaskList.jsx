export default function TaskList({ tasks }) {
  if (!tasks || tasks.length === 0) {
    return <div className="text-sm text-gray-500">No tasks yet.</div>;
  }

  return (
    <div className="grid gap-3">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 text-sm"
        >
          <div className="flex justify-between items-center mb-1">
            <div className="font-semibold">{task.title}</div>
            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700">
              {task.status}
            </span>
          </div>
          {task.description && (
            <p className="text-xs text-gray-600 dark:text-gray-300">
              {task.description}
            </p>
          )}
          <div className="text-[11px] mt-1 text-gray-500">
            Created by: {task.createdBy?.name} | Assigned to:{" "}
            {task.assignedTo?.name}
          </div>
        </div>
      ))}
    </div>
  );
}
