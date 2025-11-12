import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";

interface Task {
  id: string;
  taskName: string;
  taskDescription: string;
  taskStatus: string;
}

export default function ViewTasksScreen() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState("ALL");
  const [loading, setLoading] = useState(false);

  const handleFilter = async (filter: string) => {
    setStatus(filter);
    setLoading(true);

    try {
      const url =
        filter === "ALL"
          ? "http://localhost:8085/filterBookings/all"
          : `http://localhost:8085/filterBookings/${filter}`;

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Task[] = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFilter("ALL");
  }, []);

  return (
    <div className="flex flex-col items-center justify-start flex-1 w-full h-full bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 overflow-auto p-4">
      <Card className="w-full max-w-md space-y-6 p-6 shadow-md rounded-2xl bg-white">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
            My Task
          </h1>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { key: "ALL", label: "All" },
            { key: "PENDING", label: "Pending" },
            { key: "IN_PROGRESS", label: "In Progress" },
            { key: "COMPLETED", label: "Done" },
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button" // prevents page reload
              onClick={() => handleFilter(key)} // ✅ no event param
              className={`px-4 py-2 rounded-md transition ${
                status === key
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-800 hover:bg-blue-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : tasks.length === 0 ? (
            <p className="text-center text-gray-500">
              No tasks found for {status}.
            </p>
          ) : (
            <ul className="space-y-3">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
                >
                  <strong className="text-lg text-gray-900 block">
                    {task.taskName}
                  </strong>
                  <p className="text-gray-600 text-sm">{task.taskDescription}</p>
                  <span
                    className={`text-xs font-semibold uppercase ${
                      task.taskStatus === "COMPLETED"
                        ? "text-green-600"
                        : task.taskStatus === "IN_PROGRESS"
                        ? "text-yellow-600"
                        : "text-blue-600"
                    }`}
                  >
                    {"status : " + task.taskStatus}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </div>
  );
}
