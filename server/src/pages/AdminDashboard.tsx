import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Users, Car, MapPin, DollarSign, Check, X } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCaptains: 0,
    totalRides: 0,
    totalRevenue: 0,
  });
  const [rideRequests, setRideRequests] = useState([]);
  const [captains, setCaptains] = useState([]);
  const [userActivity, setUserActivity] = useState([]);
  const [captainActivity, setCaptainActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, requestsRes, captainsRes, userActRes, captainActRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/ride-requests'),
        axios.get('/api/admin/captains'),
        axios.get('/api/admin/user-activity'),
        axios.get('/api/admin/captain-activity'),
      ]);

      setStats(statsRes.data);
      setRideRequests(requestsRes.data);
      setCaptains(captainsRes.data);
      setUserActivity(userActRes.data);
      setCaptainActivity(captainActRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleRideAction = async (rideId, action) => {
    try {
      await axios.post(`/api/admin/rides/${rideId}/${action}`);
      fetchDashboardData();
    } catch (error) {
      console.error('Error handling ride action:', error);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <Users className="w-8 h-8 mb-4" />
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <Car className="w-8 h-8 mb-4" />
          <h3 className="text-lg font-semibold">Total Captains</h3>
          <p className="text-3xl font-bold">{stats.totalCaptains}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <MapPin className="w-8 h-8 mb-4" />
          <h3 className="text-lg font-semibold">Total Rides</h3>
          <p className="text-3xl font-bold">{stats.totalRides}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <DollarSign className="w-8 h-8 mb-4" />
          <h3 className="text-lg font-semibold">Total Revenue</h3>
          <p className="text-3xl font-bold">₹{stats.totalRevenue}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Rides Overview</h3>
        <div className="h-80">
          <BarChart width={800} height={300} data={stats.rideStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="rides" fill="#000000" />
            <Bar dataKey="revenue" fill="#666666" />
          </BarChart>
        </div>
      </div>
    </div>
  );

  const renderRideRequests = () => (
    <div className="space-y-6">
      {rideRequests.map((request) => (
        <div key={request._id} className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">{request.user.firstName} {request.user.lastName}</h3>
              <p className="text-gray-600">{request.user.phone}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">₹{request.fare}</p>
              <p className="text-gray-600">{request.paymentMethod}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <p>
              <span className="font-semibold">Pickup:</span> {request.pickup.address}
            </p>
            <p>
              <span className="font-semibold">Destination:</span> {request.destination.address}
            </p>
          </div>
          <div className="mt-4 flex justify-end space-x-4">
            <button
              onClick={() => handleRideAction(request._id, 'accept')}
              className="flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              <Check className="w-4 h-4 mr-2" />
              Accept
            </button>
            <button
              onClick={() => handleRideAction(request._id, 'reject')}
              className="flex items-center px-4 py-2 border border-black rounded-md hover:bg-gray-100"
            >
              <X className="w-4 h-4 mr-2" />
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCaptainConfirmation = () => (
    <div className="space-y-6">
      {captains.map((captain) => (
        <div key={captain._id} className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{captain.name}</h3>
              <p className="text-gray-600">{captain.vehicleNumber}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{captain.vehicleType}</p>
              <p className="text-gray-600">Rating: {captain.rating}</p>
            </div>
          </div>
          <div className="mt-4">
            <p>
              <span className="font-semibold">License:</span> {captain.licenseNumber}
            </p>
            <p>
              <span className="font-semibold">Location:</span> {captain.taxiLocation}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>

        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'dashboard'
                ? 'bg-black text-white'
                : 'bg-white text-black border border-black'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'requests'
                ? 'bg-black text-white'
                : 'bg-white text-black border border-black'
            }`}
          >
            Ride Requests
          </button>
          <button
            onClick={() => setActiveTab('captains')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'captains'
                ? 'bg-black text-white'
                : 'bg-white text-black border border-black'
            }`}
          >
            Captain Confirmation
          </button>
        </div>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'requests' && renderRideRequests()}
        {activeTab === 'captains' && renderCaptainConfirmation()}
      </div>
    </div>
  );
};

export default AdminDashboard;