import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';

const LoginPage = () => {
  const [userType, setUserType] = useState('user');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-md mx-auto bg-white p-8 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-center mb-8">
          <Car className="h-8 w-8 text-black" />
          <span className="ml-2 text-xl font-bold">RideShare</span>
        </div>

        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 ${
              userType === 'user'
                ? 'bg-black text-white'
                : 'bg-white text-black border border-black'
            } rounded-l-md`}
            onClick={() => setUserType('user')}
          >
            User
          </button>
          <button
            className={`px-4 py-2 ${
              userType === 'captain'
                ? 'bg-black text-white'
                : 'bg-white text-black border border-black'
            } rounded-md border-l-0`}
            onClick={() => setUserType('captain')}
          >
            Captain
          </button>
          <button
            className={`px-4 py-2 ${
              userType === 'admin'
                ? 'bg-black text-white'
                : 'bg-white text-black border border-black'
            } rounded-r-md border-l-0`}
            onClick={() => setUserType('admin')}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {userType === 'admin' ? (
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-black"
              required
            />
          ) : (
            <input
              type="tel"
              placeholder="Phone Number"
              pattern="[0-9]{10}"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-black"
              required
            />
          )}
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-black"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-black"
            required
          />

          <button
            type="submit"
            className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-black hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;