import React, { useState } from 'react';
import LiveMap from '../components/LiveMap';
import { getAddressCoordinates, getRouteDetails, getLocationSuggestions } from '../utils/mapUtils';

const UserDashboard = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [suggestions, setSuggestions] = useState({ pickup: [], destination: [] });
  const [routeDetails, setRouteDetails] = useState(null);

  const handleLocationSelect = async (type: 'pickup' | 'destination', value: string) => {
    try {
      if (type === 'pickup') {
        setPickup(value);
        const coords = await getAddressCoordinates(value);
        setPickupCoords(coords);
      } else {
        setDestination(value);
        const coords = await getAddressCoordinates(value);
        setDestinationCoords(coords);
      }

      if (pickup && destination) {
        const details = await getRouteDetails(pickup, destination);
        setRouteDetails(details);
      }
    } catch (error) {
      console.error('Error selecting location:', error);
    }
  };

  const handleLocationInput = async (type: 'pickup' | 'destination', value: string) => {
    try {
      const suggestions = await getLocationSuggestions(value);
      setSuggestions(prev => ({
        ...prev,
        [type]: suggestions
      }));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Book a Ride</h1>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Pickup Location</label>
                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => {
                    setPickup(e.target.value);
                    handleLocationInput('pickup', e.target.value);
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                  placeholder="Enter pickup location"
                />
                {suggestions.pickup.length > 0 && (
                  <ul className="mt-2 border border-gray-200 rounded-md">
                    {suggestions.pickup.map((suggestion) => (
                      <li
                        key={suggestion.placeId}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleLocationSelect('pickup', suggestion.description)}
                      >
                        {suggestion.description}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Destination</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    handleLocationInput('destination', e.target.value);
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                  placeholder="Enter destination"
                />
                {suggestions.destination.length > 0 && (
                  <ul className="mt-2 border border-gray-200 rounded-md">
                    {suggestions.destination.map((suggestion) => (
                      <li
                        key={suggestion.placeId}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleLocationSelect('destination', suggestion.description)}
                      >
                        {suggestion.description}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {routeDetails && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Route Details</h2>
                <p>Distance: {routeDetails.distance}</p>
                <p>Duration: {routeDetails.duration}</p>
                <button
                  className="mt-4 w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
                >
                  Book Now
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <LiveMap
              sourceCoords={pickupCoords}
              destinationCoords={destinationCoords}
              minimized={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;