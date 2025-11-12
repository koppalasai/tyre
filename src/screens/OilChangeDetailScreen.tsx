import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";

type Shop = { id: string; name: string; distanceKm: number; rating: number; price: number; etaMinutes: number };
const SHOPS: Shop[] = [
  { id: "o1", name: "Quick Lube Center", distanceKm: 1.4, rating: 4.4, price: 60, etaMinutes: 30 },
  { id: "o2", name: "Prime Oil & Filter", distanceKm: 2.0, rating: 4.6, price: 70, etaMinutes: 40 },
  { id: "o3", name: "Eco Oil Garage", distanceKm: 3.2, rating: 4.3, price: 65, etaMinutes: 35 },
];

export default function OilChangeDetailScreen() {
  const navigate = useNavigate();
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [tier, setTier] = useState<"standard" | "premium">("standard");
  const multiplier = tier === "premium" ? 1.15 : 1;
  const displayed = useMemo(() => SHOPS.map((s) => ({ ...s, price: Math.round(s.price * multiplier) })), [multiplier]);
  const selectedShop = useMemo(() => displayed.find((s) => s.id === selectedShopId) ?? null, [selectedShopId, displayed]);

  return (
    <div className="flex flex-col w-screen min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
      <header className="bg-white shadow p-4 flex items-center justify-between">
        <Button variant="secondary" onClick={() => navigate(-1)}>← Back</Button>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Oil Change</h1>
        <div className="w-20" />
      </header>
      <main className="flex-1 p-4 sm:p-6">
        <div className="mx-auto max-w-4xl space-y-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Pricing</h2>
                <p className="text-sm text-gray-600">Standard vs Premium oil and filters.</p>
              </div>
              <div className="flex gap-2">
                <Button variant={tier === "standard" ? "primary" : "secondary"} onClick={() => setTier("standard")}>Standard</Button>
                <Button variant={tier === "premium" ? "primary" : "secondary"} onClick={() => setTier("premium")}>Premium</Button>
              </div>
            </div>
          </Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayed.map((shop) => {
              const isSelected = selectedShopId === shop.id;
              return (
                <Card key={shop.id} className={`cursor-pointer ${isSelected ? "ring-2 ring-blue-600" : "ring-0"}`}>
                  <button className="w-full text-left" onClick={() => setSelectedShopId(shop.id)}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-gray-800">{shop.name}</h3>
                        <p className="text-sm text-gray-600">Rating: {shop.rating}★ • {shop.distanceKm} km</p>
                        <p className="text-sm text-gray-600">ETA: ~{shop.etaMinutes} min</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">${shop.price}</p>
                        <p className="text-xs text-gray-500">per job</p>
                      </div>
                    </div>
                  </button>
                </Card>
              );
            })}
          </div>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Selection</h2>
                <p className="text-sm text-gray-600">{selectedShop ? `Shop: ${selectedShop.name} • Tier: ${tier}` : "Pick a shop to proceed."}</p>
              </div>
              <Button disabled={!selectedShop} onClick={() => selectedShop && navigate("/dashboard/service-category/oil-change/book", { state: { shop: selectedShop, tier } })}>Proceed to Booking</Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}