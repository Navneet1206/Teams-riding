import React from 'react';
import { MapPin, Navigation, Clock, DollarSign } from 'lucide-react';

interface RideHistoryCardProps {
  ride: {
    pickup: { address: string };
    destination: { address: string };
    duration: number;
    fare: number;
    status: string;
    createdAt: string;
    captain?: {
      name: string;
      vehicleNumber: string;
    };
  };
}

const RideHistoryCard: React.FC<RideHistoryCardProps> = ({ ride }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div className="text-sm text-gray-600">
          {new Date(ride.createdAt).toLocaleDateString()}
        </div>
        <div className={`px-2 py-1 rounded-full text-sm ${
          ride.status === 'completed' ? 'bg-black text-white' : 'bg-gray-100'
        }`}>
          {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start">
          <MapPin className="w-5 h-5 mr-2 mt-1" />
          <div>
            <p className="text-sm text-gray-600">Pickup</p>
            <p>{ride.pickup.address}</p>
          </div>
        </div>

        <div className="flex items-start">
          <Navigation className="w-5 h-5 mr-2 mt-1" />
          <div>
            <p className="text-sm text-gray-600">Destination</p>
            <p>{ride.destination.address}</p>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p>{Math.round(ride.duration / 60)} mins</p>
            </div>
          </div>

          <div className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Fare</p>
              <p>₹{ride.fare}</p>
            </div>
          </div>
        </div>

        {ride.captain && (
          <div className="border-t pt-4 mt-4">
            <p className="text-sm text-gray-600">Captain Details</p>
            <p className="font-medium">{ride.captain.name}</p>
            <p className="text-sm text-gray-600">{ride.captain.vehicleNumber}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RideHistoryCard;