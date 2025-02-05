import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Upload, LoaderCircle, X } from 'lucide-react';
import axios from 'axios';

const SignupPage = () => {
  const [userType, setUserType] = useState<'user' | 'captain'>('user');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    profilePhoto: null as File | null,
    licenseNumber: '',
    licensePhoto: null as File | null,
    taxiLocation: '',
    vehicleNumber: '',
    age: '',
    vehicleType: 'hatchback',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  // Handle Text Inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle File Inputs & Show Preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file) {
        setFormData((prev) => ({ ...prev, [e.target.name]: file }));
        setImagePreview(URL.createObjectURL(file));
      }
    }
  };

  // Remove Selected Image
  const removeImage = () => {
    setFormData((prev) => ({ ...prev, profilePhoto: null }));
    setImagePreview(null);
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setLoading(false);
      setError('Passwords do not match!');
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) formDataToSend.append(key, value);
    });

    try {
      const response = await axios.post(`/api/auth/${userType}/signup`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess('Signup successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
      setFormData({
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
      });
      setImagePreview(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 border border-gray-200 rounded-lg shadow-lg">
        <div className="flex items-center justify-center mb-6">
          <Car className="h-8 w-8 text-black" />
          <span className="ml-2 text-xl font-bold">RideShare</span>
        </div>

        {/* Toggle User Type */}
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 ${userType === 'user' ? 'bg-black text-white' : 'border border-black'}`}
            onClick={() => setUserType('user')}
          >
            User
          </button>
          <button
            className={`px-4 py-2 ${userType === 'captain' ? 'bg-black text-white' : 'border border-black'}`}
            onClick={() => setUserType('captain')}
          >
            Captain
          </button>
        </div>

        {/* Error & Success Messages */}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Common Fields */}
          {userType === 'user' ? (
            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="firstName" placeholder="First Name" className="input-field" required onChange={handleInputChange} />
              <input type="text" name="lastName" placeholder="Last Name" className="input-field" required onChange={handleInputChange} />
            </div>
          ) : (
            <>
              <input type="text" name="firstName" placeholder="Full Name" className="input-field" required onChange={handleInputChange} />
              <input type="text" name="licenseNumber" placeholder="License Number" className="input-field" required onChange={handleInputChange} />
              <select name="vehicleType" className="input-field" required onChange={handleInputChange}>
                <option value="hatchback">Hatchback (4-seater)</option>
                <option value="sedan">Sedan (4-seater)</option>
                <option value="suv">SUV (7-seater)</option>
                <option value="muv">MUV/MPV (7-9 seater)</option>
              </select>
            </>
          )}

          <input type="email" name="email" placeholder="Email" className="input-field" required onChange={handleInputChange} />
          <input type="tel" name="phone" placeholder="Phone Number" className="input-field" pattern="[0-9]{10}" required onChange={handleInputChange} />
          <input type="password" name="password" placeholder="Password" className="input-field" required onChange={handleInputChange} />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" className="input-field" required onChange={handleInputChange} />

          {/* Profile Photo Upload */}
          <label className="file-upload">
            <Upload className="w-8 h-8 text-gray-500" />
            <p className="text-sm">{imagePreview ? 'Change Profile Photo' : 'Click to upload profile photo'}</p>
            <input type="file" name="profilePhoto" className="hidden" accept="image/*" onChange={handleFileChange} required />
          </label>

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative w-24 h-24 mx-auto mt-4">
              <img src={imagePreview} alt="Preview" className="w-full h-full rounded-full object-cover" />
              <button onClick={removeImage} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800">
            {loading ? <LoaderCircle className="animate-spin mx-auto" /> : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
