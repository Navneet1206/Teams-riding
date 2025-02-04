import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Upload } from 'lucide-react';

const SignupPage = () => {
  const [userType, setUserType] = useState('user');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    profilePhoto: null,
    licenseNumber: '',
    licensePhoto: null,
    taxiLocation: '',
    vehicleNumber: '',
    age: '',
    vehicleType: 'hatchback'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
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
            } rounded-r-md`}
            onClick={() => setUserType('captain')}
          >
            Captain
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {userType === 'user' ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                  required
                />
              </div>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                required
              />
              <input
                type="text"
                placeholder="License Number"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                required
              />
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                required
              >
                <option value="hatchback">Hatchback (4-seater)</option>
                <option value="sedan">Sedan (4-seater)</option>
                <option value="suv">SUV (7-seater)</option>
                <option value="muv">MUV/MPV (7-9 seater)</option>
              </select>
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-black"
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            pattern="[0-9]{10}"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-black"
            required
          />
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

          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> profile photo
                </p>
              </div>
              <input type="file" className="hidden" accept="image/*" required />
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-black hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;