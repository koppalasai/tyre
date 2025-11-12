import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// Switched from Supabase insert to MongoDB-backed API POST
import { useAuth } from "../components/AuthProvider";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";

export default function OilChangeBookingScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const state = (location.state ?? {}) as any;
  const selectedShop = state.shop ?? null;
  const tier = state.tier ?? "standard";

  const [form, setForm] = useState({ date: "", time: "", vehicleMake: "", vehicleModel: "", registration: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedShop || !user) {
      setMessage("Missing shop selection or user.");
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      const response = await fetch("http://localhost:8085/createBooking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          
          service_type: "oil-change",
          tier,
          shop_id: selectedShop.id,
          shop_name: selectedShop.name,
          price: selectedShop.price,
          eta_minutes: selectedShop.etaMinutes,
          date: form.date,
          time: form.time,
          vehicle_make: form.vehicleMake,
          vehicle_model: form.vehicleModel,
          registration: form.registration,
          notes: form.notes,
        }),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `HTTP ${response.status}`);
      }
      navigate("/dashboard/bookings");
    } catch (err: any) {
      setMessage(err.message ?? "Failed to confirm booking.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-screen min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
      <header className="bg-white shadow p-4 flex items-center justify-between">
        <Button variant="secondary" onClick={() => navigate(-1)}>← Back</Button>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Oil Change — Booking</h1>
        <div className="w-20" />
      </header>
      <main className="flex-1 p-4 sm:p-6">
        <div className="mx-auto max-w-4xl space-y-4">
          <Card>
            {selectedShop ? (
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{selectedShop.name}</h2>
                  <p className="text-sm text-gray-600">Rating: {selectedShop.rating}★ • {selectedShop.distanceKm} km</p>
                  <p className="text-sm text-gray-600">ETA: ~{selectedShop.etaMinutes} min</p>
                  <p className="text-sm text-gray-600">Tier: {tier}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">${selectedShop.price}</p>
                  <p className="text-xs text-gray-500">per job</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">No shop selected. Please choose one first.</p>
                <Button onClick={() => navigate("/dashboard/service-category/oil-change")}>Select Shop</Button>
              </div>
            )}
          </Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Card>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <input type="date" name="date" value={form.date} onChange={onChange} className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300" required />
                </div>
                <div>
                  <label className="text-sm font-medium">Time</label>
                  <input type="time" name="time" value={form.time} onChange={onChange} className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300" required />
                </div>
                <Input label="Vehicle Make" name="vehicleMake" value={form.vehicleMake} onChange={onChange} placeholder="e.g., Toyota" required />
                <Input label="Vehicle Model" name="vehicleModel" value={form.vehicleModel} onChange={onChange} placeholder="e.g., Corolla" required />
                <Input label="Registration Number" name="registration" value={form.registration} onChange={onChange} placeholder="e.g., ABC-1234" required />
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium">Notes</label>
                  <textarea name="notes" value={form.notes} onChange={onChange} placeholder="Any specific requests?" className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300 min-h-[80px]" />
                </div>
              </div>
            </Card>
            <div className="flex justify-end">
              <Button type="submit" isLoading={submitting} className="w-full sm:w-auto">Confirm Booking</Button>
            </div>
          </form>
          {message && <p className="text-center text-sm text-red-700">{message}</p>}
        </div>
      </main>
    </div>
  );
}