import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../context/SocketContext';
import LiveMap from '../components/LiveMap';
import { Navigation, MapPin, Clock, DollarSign, Power, RefreshCw } from 'lucide-react';
import axios from 'axios';

const CaptainDashboard = () => {
  const [status, setStatus] = useState('active');
  const [currentRide, setCurrentRide] = useState(null);
  const [rideRequests, setRideRequests] = useState([]);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    // Listen for new ride requests
    socket?.on('ride-request', (request) => {
      setRideRequests((prev) => [...prev, request]);
    });

    return () => {
      socket?.off('ride-request');
    };
  }, [socket]);

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.post('/api/captains/status', { status: newStatus });
      setStatus(newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleAcceptRide = async (rideId) => {
    try {
      const response = await axios.post(`/api/rides/${rideId}/accept`);
      setCurrentRide(response.data);
      setRideRequests(rideRequests.filter(req => req._id !== rideId));
    } catch (error) {
      console.error('Error accepting ride:', error);
    }
  };

  const handleCompleteRide = async () => {
    try {
      await axios.post(`/api/rides/${currentRide._id}/complete`);
      setCurrentRide(null);
      setStatus('active');
    } catch (error) {
      console.error('Error completing ride:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Captain Dashboard</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => handleStatusChange('active')}
              className={`px-4 py-2 rounded-md ${
                status === 'active'
                  ? 'bg-black text-white'
                  : 'bg-white text-black border border-black'
              }`}
            >
              <RefreshCw className="w-5 h-5 inline-block mr-2" />
              Active
            </button>
            <button
              onClick={() => handleStatusChange('riding')}
              className={`px-4 py-2 rounded-md ${
                status === 'riding'
                  ? 'bg-black text-white'
                  : 'bg-white text-black border border-black'
              }`}
            >
              <Navigation className="w-5 h-5 inline-block mr-2" />
              Riding
            </button>
            <button
              onClick={() => handleStatusChange('offline')}
              className={`px-4 py-2 rounded-md ${
                status === 'offline'
                  ? 'bg-black text-white'
                  : 'bg-white text-black border border-black'
              }`}
            >
              <Power className="w-5 h-5 inline-block mr-2" />
              Offline
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {currentRide ? (
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Current Ride</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Pickup</p>
                      <p>{currentRide.pickup.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Navigation className="w-5 h-5 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Destination</p>
                      <p>{currentRide.destination.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p>{Math.round(currentRide.duration / 60)} mins</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Fare</p>
                      <p>₹{currentRide.fare}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCompleteRide}
                    className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
                  >
                    Complete Ride
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {rideRequests.map((request) => (
                  <div
                    key={request._id}
                    className="bg-white border border-gray-200 rounded-lg p-6"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 mr-2" />
                        <div>
                          <p className="text-sm text-gray-600">Pickup</p>
                          <p>{request.pickup.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Navigation className="w-5 h-5 mr-2" />
                        <div>
                          <p className="text-sm text-gray-600">Destination</p>
                          <p>{request.destination.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 mr-2" />
                        <div>
                          <p className="text-sm text-gray-600">Duration</p>
                          <p>{Math.round(request.duration / 60)} mins</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-5 h-5 mr-2" />
                        <div>
                          <p className="text-sm text-gray-600">Fare</p>
                          <p>₹{request.fare}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAcceptRide(request._id)}
                        className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
                      >
                        Accept Ride
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="h-[600px]">
            <LiveMap
              sourceCoords={currentRide?.pickup.coordinates}
              destinationCoords={currentRide?.destination.coordinates}
              minimized={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptainDashboard;