import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFoundScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-3">
        <div className="text-5xl font-bold text-gray-900">404</div>
        <div className="text-lg text-gray-600">Oops! Page not found</div>
        <button
          className="text-blue-600 underline"
          onClick={() => navigate("/")}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
