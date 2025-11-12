import React, { useState, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

export default function DetectLocationWithMap() {
  const [location, setLocation] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const handleDetectLocation = useCallback(() => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });

        try {
          const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
          );

          const data = await response.json();
          if (data.status === "OK" && data.results.length > 0) {
            setLocation(data.results[0].formatted_address);
          } else {
            setError("Could not fetch location details.");
          }
        } catch (err) {
          console.error(err);
          setError("Failed to fetch location details.");
        } finally {
          setLoading(false);
        }
      },
      (geoError) => {
        setError(geoError.message || "Failed to get your location.");
        setLoading(false);
      }
    );
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 p-4">
      <button
        onClick={handleDetectLocation}
        disabled={loading}
        className="px-6 py-3 text-white bg-blue-600 rounded-2xl shadow-lg hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Detecting..." : "Detect My Location"}
      </button>

      {location && (
        <p className="mt-4 text-gray-800 text-center font-medium max-w-md">
          📍 You are currently at:
          <br />
          <span className="text-blue-700">{location}</span>
        </p>
      )}

      {error && (
        <p className="mt-4 text-red-600 font-semibold text-center">{error}</p>
      )}

      {isLoaded && coords && (
        <div className="mt-6 w-full max-w-2xl h-80 rounded-xl overflow-hidden shadow-lg border border-gray-300">
          <GoogleMap
            center={coords}
            zoom={15}
            mapContainerStyle={{ width: "100%", height: "100%" }}
          >
            <Marker position={coords} />
          </GoogleMap>
        </div>
      )}
    </div>
  );
}
