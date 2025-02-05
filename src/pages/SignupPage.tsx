import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Upload, Loader, X } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  profilePhoto: File | null;
  licenseNumber: string;
  licensePhoto: File | null;
  taxiLocation: string;
  vehicleNumber: string;
  age: string;
  vehicleType: 'hatchback' | 'sedan' | 'suv' | 'muv';
}

const INITIAL_FORM_DATA: FormData = {
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
  vehicleType: 'hatchback',
};

const SignupPage = () => {
  const [userType, setUserType] = useState<'user' | 'captain'>('user');
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const validateForm = (): string | null => {
    if (formData.password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Please enter a valid email address';
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      return 'Please enter a valid 10-digit phone number';
    }
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size should not exceed 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: file,
      }));
      setError(null);
    }
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      profilePhoto: null
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
  
    setLoading(true);
    setError(null);
    setSuccess(null);
  
    const formDataToSend = new FormData();
  
    // 🔹 Fix: Ensure correct field names based on userType
    if (userType === 'user') {
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
    } else {
      formDataToSend.append('name', formData.firstName); // 🔹 Fix: Rename for Captains
      formDataToSend.append('licenseNumber', formData.licenseNumber);
      formDataToSend.append('taxiLocation', formData.taxiLocation);
      formDataToSend.append('vehicleNumber', formData.vehicleNumber);
      formDataToSend.append('age', formData.age);
      formDataToSend.append('vehicleType', formData.vehicleType);
    }
  
    // Common Fields for Both User & Captain
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('password', formData.password);
    
    if (formData.profilePhoto) {
      formDataToSend.append('profilePhoto', formData.profilePhoto);
    }
  
    if (userType === 'captain' && formData.licensePhoto) {
      formDataToSend.append('licensePhoto', formData.licensePhoto);
    }
  
    try {
      const response = await fetch(`/api/auth/${userType}/signup`, {
        method: 'POST',
        body: formDataToSend,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }
  
      setSuccess('Signup successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed!');
    } finally {
      setLoading(false);
    }
  };
  
  // Cleanup function for image preview URL
  React.useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto bg-white p-8 border border-gray-200 rounded-lg shadow-lg">
        <div className="flex items-center justify-center mb-6">
          <Car className="h-8 w-8 text-black" />
          <span className="ml-2 text-xl font-bold">RideShare</span>
        </div>

        <div className="flex justify-center mb-6 space-x-2">
          <button
            type="button"
            className={`px-6 py-2 rounded-md transition-colors ${
              userType === 'user'
                ? 'bg-black text-white'
                : 'bg-white text-black border border-black hover:bg-gray-50'
            }`}
            onClick={() => setUserType('user')}
          >
            User
          </button>
          <button
            type="button"
            className={`px-6 py-2 rounded-md transition-colors ${
              userType === 'captain'
                ? 'bg-black text-white'
                : 'bg-white text-black border border-black hover:bg-gray-50'
            }`}
            onClick={() => setUserType('captain')}
          >
            Captain
          </button>
        </div>

        {(error || success) && (
          <div className={`p-4 mb-4 rounded-md ${error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {error || success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {userType === 'user' ? (
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
                onChange={handleInputChange}
              />
            </div>
          ) : (
            <>
              <input
                type="text"
                name="firstName"
                placeholder="Full Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="licenseNumber"
                placeholder="License Number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
                onChange={handleInputChange}
              />
              <select
                name="vehicleType"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
                onChange={handleInputChange}
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
            name="email"
            placeholder="Email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            required
            onChange={handleInputChange}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            required
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            required
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            required
            onChange={handleInputChange}
          />

          <div className="relative">
            {imagePreview ? (
              <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-300">
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="block p-4 border-2 border-dashed border-gray-300 rounded-md text-center cursor-pointer hover:border-gray-400">
                <Upload className="w-8 h-8 mx-auto text-gray-500" />
                <p className="mt-2 text-sm text-gray-500">Click to upload profile photo</p>
                <p className="text-xs text-gray-400">Max size: 5MB</p>
                <input
                  type="file"
                  name="profilePhoto"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </label>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader className="animate-spin mx-auto" /> : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-black hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;