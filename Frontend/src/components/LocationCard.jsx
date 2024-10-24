// LocationCard.js
import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { BASE_URL } from './constants'

const LocationCard = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const [dateTime, setDateTime] = useState("");

  // Default center for the map
  const defaultCenter = {
    lat: 0,
    lng: 0,
  };

  const handleTrackLocation = async () => {
    const apiKey = "YOUR_GOOGLE_API_KEY"; // Replace with your actual API key
    const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${phoneNumber}&key=${apiKey}`;

    try {
      const response = await fetch(geocodingUrl);
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        const locationData = data.results[0].geometry.location;
        setLocation(locationData);
        setDateTime(new Date().toLocaleString());
        setError("");
      } else {
        setError("Location not found for the entered phone number.");
      }
    } catch (error) {
      setError("Error tracking location.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Track Location</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
          <div className="mb-4">
            <p className="text-gray-600 font-semibold">Phone Number:</p>
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full mt-2"
              placeholder="Enter Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <button
            onClick={handleTrackLocation}
            className="bg-gradient-to-tr from-blue-500 hover:shadow-lg to-black text-white py-2 px-4 rounded mb-4"
          >
            Track Location
          </button>

          {error && <p className="text-red-500">{error}</p>}

          {location && (
            <div className="text-gray-800">
              <p>
                <strong>Coordinates:</strong>
              </p>
              <p>Latitude: {location.lat}</p>
              <p>Longitude: {location.lng}</p>
              <p>
                <strong>Tracked on:</strong> {dateTime}
              </p>
            </div>
          )}
        </div>

        {/* Display Map when location is available */}
        {location && (
          <div className="col-span-1 lg:col-span-2">
            <LoadScript googleMapsApiKey="YOUR_GOOGLE_API_KEY">
              <GoogleMap
                mapContainerStyle={{ height: "300px", width: "100%" }}
                center={location}
                zoom={14}
              >
                <Marker position={location} />
              </GoogleMap>
            </LoadScript>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationCard;
