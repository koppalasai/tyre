import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";

export default function MyTaskScreen() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleAddAnother = () => {
    setSubmitted(false);
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log(e);
    e.preventDefault();
    const target = e.target as typeof e.target & {
      taskName: { value: string };
      taskDescription: { value: string };
      taskStatus: { value: string };
    };

    // 🟩 Form your payload object
    const payload = {
      taskName: target.taskName.value,
      taskDescription: target.taskDescription.value,
      taskStatus: target.taskStatus.value,
    };
    console.log(payload);
    try {
      const response = await fetch("http://localhost:8085/createTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log("✅ Task saved successfully!");
        setMessage("✅ Task created successfully!");
        setSubmitted(true);
        // setTask({ title: "", description: "" }); // clear form
      } else {
        console.log("❌ Failed to save task!");
        setMessage("❌ Failed to create task!");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("⚠️ Error connecting to backend!");
    }
    // navigate("/view-tasks");
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
      <Card className="w-full max-w-md space-y-6">
        <div className="flex justify-end">
          <Button type="button" variant="secondary" onClick={() => navigate("/dashboard/view-tasks")}> 
                      View
          </Button>

        </div>
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            My Task
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
            Add details for your task below.
          </p>
        </div>

        {!submitted?<form
          className="space-y-4"
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <Input label="Task Name" placeholder="Enter task name" name="taskName" />
          <Input label="Task Description" placeholder="Enter task description" name="taskDescription" />
          <Input label="Task Status" placeholder="e.g., Pending / In Progress" name="taskStatus" />

          <div className="flex justify-center">
            <Button type="submit" className="w-full sm:w-auto">
              Submit
            </Button>
          </div>
        </form>:(<div className="text-center space-y-4">
            <p className="text-green-600 font-semibold">{message}</p>
            <Button
              type="button"
              onClick={handleAddAnother}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Add Another Task
            </Button>
          </div>)}
      </Card>
    </div>
  );
}
