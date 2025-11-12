import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import Card from "../components/Card";
import Button from "../components/Button";

type Booking = {
  _id?: string;
  id?: string;
  user_id: string;
  service_type: string;
  tier: string;
  shop_id: string;
  shop_name: string;
  price: number;
  eta_minutes: number;
  date: string;
  time: string;
  vehicle_make: string;
  vehicle_model: string;
  registration: string;
  notes?: string;
  created_at?: string;
};

const SERVICE_EMOJI: Record<string, string> = {
  "tyre-change": "🛞",
  "wheel-alignment": "📐",
  balancing: "⚖️",
  "oil-change": "🛢️",
  "battery-check": "🔋",
};

export default function BookingsScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("ALL");

  const visibleBookings = useMemo(() => {
    if (filter === "ALL") return bookings;
    return bookings.filter((b) => b.service_type === filter);
  }, [bookings, filter]);

  // Adopt ViewTasksScreen-style fetching with a filter param
  const handleFilterFetch = async (serverFilter: string) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const base =
        serverFilter === "ALL"
          ? "http://localhost:8085/filterBookings/all"
          : `http://localhost:8085/filterBookings/${encodeURIComponent(serverFilter)}`;
      const url = `${base}?userId=${encodeURIComponent(user.id)}`;
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `HTTP ${response.status}`);
      }
      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load mirrors ViewTasksScreen -> handleFilter("ALL")
    handleFilterFetch("ALL");
  }, [user]);

  return (
    <div className="flex flex-col w-screen min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
      {/* Header */}
      <header className="bg-white shadow p-4 flex items-center justify-between">
        <Button variant="secondary" onClick={() => navigate(-1)}>← Back</Button>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Bookings</h1>
        <div className="w-20" />
      </header>

      {/* Content */}
      <main className="flex-1 p-4 sm:p-6">
        <div className="mx-auto max-w-4xl space-y-4">
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {(["ALL", "tyre-change", "wheel-alignment", "balancing", "oil-change", "battery-check"]) .map((key) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`px-3 py-1 rounded-full text-sm ${filter === key ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"}`}
                  >
                    {key === "ALL" ? "All" : `${SERVICE_EMOJI[key] ?? ""} ${key}`}
                  </button>
                ))}
              </div>
              <div className="text-sm text-gray-600">{bookings.length} total</div>
            </div>
          </Card>

          {loading ? (
            <Card>
              <p className="text-center text-gray-600">Loading bookings…</p>
            </Card>
          ) : error ? (
            <Card>
              <p className="text-center text-red-700">{error}</p>
            </Card>
          ) : visibleBookings.length === 0 ? (
            <Card>
              <p className="text-center text-gray-600">No bookings found.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {visibleBookings.map((b) => (
                <Card key={b._id ?? b.id ?? `${b.user_id}-${b.shop_id}-${b.date}-${b.time}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl" aria-hidden>{SERVICE_EMOJI[b.service_type] ?? "🔧"}</span>
                        <h2 className="text-lg font-semibold text-gray-800">{b.shop_name}</h2>
                      </div>
                      <p className="text-sm text-gray-600">
                        {b.service_type} • Tier: {b.tier} • ETA ~{b.eta_minutes} min
                      </p>
                      <p className="text-sm text-gray-600">
                        {b.date} at {b.time} • ₹{b.price}
                      </p>
                      <p className="text-xs text-gray-500">
                        {b.vehicle_make} {b.vehicle_model} • {b.registration}
                      </p>
                      {b.notes && (
                        <p className="text-xs text-gray-500 mt-1">Notes: {b.notes}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}