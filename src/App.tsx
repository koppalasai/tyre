import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  Link,
  Outlet,
} from "react-router-dom";

import Signup from "./components/Signup";
import LocationButton from "./components/LocationButton";
import {
  AuthProvider,
  ProtectedRoute,
  useAuth,
} from "./components/AuthProvider";
import { supabase } from "./lib/supabaseClient";

import {
  HomeScreen,
  NotFoundScreen,
  MyTaskScreen,
  ViewTasksScreen,
  BookingsScreen,
  ServiceCategoryScreen,
  TyreChangeDetailScreen,
  TyreChangeBookingScreen,
  WheelAlignmentDetailScreen,
  WheelAlignmentBookingScreen,
  BalancingDetailScreen,
  BalancingBookingScreen,
  OilChangeDetailScreen,
  OilChangeBookingScreen,
  BatteryCheckDetailScreen,
  BatteryCheckBookingScreen,
} from "./screens";



// -----------------------------
// Sign In Page
// -----------------------------
function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    if (session) navigate("/dashboard", { replace: true });
  }, [session, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) setError(error.message);
    else navigate("/dashboard", { replace: true });
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
      <div className="w-full max-w-md bg-white shadow rounded-lg p-6">
        <h1 className="flex items-center justify-center text-2xl font-semibold mb-4">Sign in</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
          {error && (
            <div className="mt-2 text-sm text-red-600" role="alert">
              {error}
            </div>
          )}
          <p className="flex items-center justify-center mt-4 text-sm text-gray-600">
            No account?{" "}
            <a href="/signup" className="text-indigo-600 hover:underline">
              Create one
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}


// -----------------------------
// Dashboard Layout
// -----------------------------
function DashboardLayout() {
  const { user } = useAuth();
  const [address, setAddress] = useState<string>("");
  const [locLoading, setLocLoading] = useState<boolean>(false);
  const [locError, setLocError] = useState<string>("");
  const HYD_VIEWBOX = "78.30,17.55,78.62,17.25"; // left,top,right,bottom (approx Hyderabad bounds)
  const HYD_CENTER = { lat: 17.3850, lon: 78.4867 };
  const isWithinHyderabad = (lat: number, lon: number) => {
    const [left, top, right, bottom] = HYD_VIEWBOX.split(",").map(parseFloat);
    return lon >= left && lon <= right && lat <= top && lat >= bottom;
  };

  const handleDetectLocation = () => {
    setLocLoading(true);
    setLocError("");
    setAddress("");

    if (!("geolocation" in navigator)) {
      setLocLoading(false);
      setLocError("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          let { latitude, longitude } = pos.coords;
          // If outside Hyderabad bounds (common with coarse IP fixes), snap to Hyderabad center
          if (!isWithinHyderabad(latitude, longitude)) {
            latitude = HYD_CENTER.lat;
            longitude = HYD_CENTER.lon;
          }
          const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&accept-language=en-IN`;
          const res = await fetch(url, { headers: { Accept: "application/json" } });
          if (!res.ok) throw new Error("Failed to fetch address.");
          const data = await res.json();
          const display = data?.display_name ?? "Unknown location";
          setAddress(display);
        } catch (e: any) {
          setLocError(e?.message ?? "Unable to fetch location.");
        } finally {
          setLocLoading(false);
        }
      },
      (err) => {
        setLocLoading(false);
        setLocError(err?.message ?? "Permission denied or unable to get location.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="flex flex-col w-screen min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-semibold text-indigo-700">Dashboard
        
        </Link>
        <div className="flex items-center gap-4">
          <p className="text-gray-600">Signed in as {user?.email}</p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-700"
          >
            Sign out
          </button>
          <button
            onClick={handleDetectLocation}
            disabled={locLoading}
            className={`rounded-md px-4 py-2 text-white ${locLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {locLoading ? "Detecting Location..." : "Detect My Location"}
          </button>
          {address && (
            <span className="text-xs text-gray-600 max-w-[40ch] truncate" title={address}>
              {address}
            </span>
          )}
          {locError && (
            <span className="text-xs text-red-600 max-w-[40ch] truncate" title={locError}>
              {locError}
            </span>
          )}
        </div>
      </header>

      {/* Navigation */}
      <div className="flex justify-center gap-4 mt-6">
        {/* use <Link> instead of <a> */}
        <Link to="/dashboard" className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">
          Home
        </Link>
        <Link to="/dashboard/my-task" className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
          My Task
        </Link>
        <Link to="/dashboard/view-tasks" className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700">
          View Tasks
        </Link>
        <Link to="/dashboard/service-category" className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700">
          Service Category
        </Link>
      </div>

      {/* Content (renders nested pages here) */}
      <main className="flex-1 p-6 flex justify-center items-start">
        <Outlet /> {/* this is where MyTaskScreen / ViewTasksScreen will show */}
      </main>
    </div>
  );
}

// -----------------------------
// Dashboard Home (default content)
// -----------------------------
function DashboardHome() {
  return (
    <div className="text-center mt-10">
      <h2 className="text-2xl font-semibold text-gray-800">
        Welcome to your Dashboard
      </h2>
     
    </div>
  );
}


// -----------------------------
// Main Router Setup
// -----------------------------
function AppRoutes() {
  const { session } = useAuth();

  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/" element={<Navigate to={session ? "/dashboard" : "/signin"} replace />} />
      <Route path="/signin" element={session ? <Navigate to="/dashboard" replace /> : <Signin />} />
      <Route path="/signup" element={session ? <Navigate to="/dashboard" replace /> : <Signup />} />

      {/* Dashboard with nested routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="my-task" element={<MyTaskScreen />} />
        <Route path="view-tasks" element={<ViewTasksScreen />} />
        <Route path="bookings" element={<BookingsScreen />} />
        <Route path="service-category" element={<ServiceCategoryScreen />} />
        <Route path="service-category/tyre-change" element={<TyreChangeDetailScreen />} />
        <Route path="service-category/tyre-change/book" element={<TyreChangeBookingScreen />} />
        <Route path="service-category/wheel-alignment" element={<WheelAlignmentDetailScreen />} />
        <Route path="service-category/wheel-alignment/book" element={<WheelAlignmentBookingScreen />} />
        <Route path="service-category/balancing" element={<BalancingDetailScreen />} />
        <Route path="service-category/balancing/book" element={<BalancingBookingScreen />} />
        <Route path="service-category/oil-change" element={<OilChangeDetailScreen />} />
        <Route path="service-category/oil-change/book" element={<OilChangeBookingScreen />} />
        <Route path="service-category/battery-check" element={<BatteryCheckDetailScreen />} />
        <Route path="service-category/battery-check/book" element={<BatteryCheckBookingScreen />} />
      </Route>
        
      

      {/* Public pages */}
      <Route path="/home" element={<HomeScreen />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  );
}


// -----------------------------
// Root Component
// -----------------------------
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}