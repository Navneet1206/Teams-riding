import React from 'react';
import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-black" />
              <span className="ml-2 text-xl font-bold">RideShare</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 border border-black text-black rounded-md hover:bg-black hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black mb-8">
            Your Journey, Our Priority
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Safe, reliable rides at your fingertips
          </p>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Quick Booking</h3>
              <p className="text-gray-600">Book your ride in seconds</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Safe Travel</h3>
              <p className="text-gray-600">Verified drivers and secure rides</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Easy Payments</h3>
              <p className="text-gray-600">Multiple payment options available</p>
            </div>
          </div>
          <Link
            to="/signup"
            className="inline-block px-8 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;