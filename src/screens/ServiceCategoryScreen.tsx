import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";

type ServiceCategory = {
  key: string;
  name: string;
  description: string;
  icon: string;
  route: string;
};

const ALL_CATEGORIES: ServiceCategory[] = [
  {
    key: "tyre-change",
    name: "Tyre Change",
    description: "Replace worn-out tyres",
    icon: "🛞",
    route: "/dashboard/service-category/tyre-change",
  },
  {
    key: "wheel-alignment",
    name: "Wheel Alignment",
    description: "Adjust wheels for straight tracking",
    icon: "📐",
    route: "/dashboard/service-category/wheel-alignment",
  },
  {
    key: "balancing",
    name: "Balancing",
    description: "Balance wheels to reduce vibration",
    icon: "⚖️",
    route: "/dashboard/service-category/balancing",
  },
  {
    key: "oil-change",
    name: "Oil Change",
    description: "Replace engine oil and filter",
    icon: "🛢️",
    route: "/dashboard/service-category/oil-change",
  },
  {
    key: "battery-check",
    name: "Battery Check",
    description: "Test battery health and connections",
    icon: "🔋",
    route: "/dashboard/service-category/battery-check",
  },
];

export default function ServiceCategoryScreen() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_CATEGORIES;
    return ALL_CATEGORIES.filter((c) => c.name.toLowerCase().includes(q));
  }, [query]);

  const handleSelect = (cat: ServiceCategory) => {
    setSelectedKey(cat.key);
    // Provide quick visual feedback, then navigate
    setTimeout(() => navigate(cat.route), 300);
  };

  return (
    <div className="flex flex-col w-screen min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
      {/* Header */}
      <header className="bg-white shadow p-4 flex items-center justify-between">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          ← Back
        </Button>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Select Service</h1>
        <div className="w-20" />
      </header>

      {/* Content */}
      <main className="flex-1 p-4 sm:p-6">
        <div className="mx-auto max-w-4xl space-y-4">
          {/* Search */}
          <Card>
            <Input
              type="text"
              placeholder="Search services..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Card>

          {/* Categories Grid/List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-1">
            {filtered.map((cat) => {
              const isSelected = selectedKey === cat.key;
              return (
                <Card
                  key={cat.key}
                  className={`cursor-pointer transition transform hover:scale-[1.01] ${
                    isSelected ? "ring-2 ring-blue-600" : "ring-0"
                  }`}
                >
                  <button
                    className="w-full text-left"
                    onClick={() => handleSelect(cat)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl" aria-hidden>{cat.icon}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {cat.name}
                        </h3>
                        <p className="text-sm text-gray-600">{cat.description}</p>
                      </div>
                    </div>
                  </button>
                </Card>
              );
            })}
            {filtered.length === 0 && (
              <Card className="sm:col-span-2 lg:col-span-3">
                <p className="text-center text-gray-600">No services found.</p>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow border-t">
        <div className="mx-auto max-w-4xl grid grid-cols-4">
          <Link to="/dashboard" className="flex flex-col items-center p-3 text-gray-800 hover:bg-gray-100">
            <span className="text-xl">🏠</span>
            <span className="text-xs">Home</span>
          </Link>
          <Link to="/dashboard/bookings" className="flex flex-col items-center p-3 text-gray-800 hover:bg-gray-100">
            <span className="text-xl">📒</span>
            <span className="text-xs">Bookings</span>
          </Link>
          <Link to="/dashboard" className="flex flex-col items-center p-3 text-gray-800 hover:bg-gray-100">
            <span className="text-xl">👛</span>
            <span className="text-xs">Wallet</span>
          </Link>
          <Link to="/dashboard" className="flex flex-col items-center p-3 text-gray-800 hover:bg-gray-100">
            <span className="text-xl">👤</span>
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
