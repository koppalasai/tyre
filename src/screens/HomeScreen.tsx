import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="page-container section grid place-items-center">
      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
          Secure Authentication
        </h1>
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
          Powered by Supabase
        </p>

        <div className="flex justify-center">
          <button
            className="bg-indigo-600 text-white px-4 sm:px-6 py-2 rounded-xl w-full sm:w-auto"
            onClick={() => navigate("/my-task")}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
