import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const VerificationPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [emailOTP, setEmailOTP] = useState('');
  const [phoneOTP, setPhoneOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState({ email: false, phone: false });

  useEffect(() => {
    if (user?.verified) {
      navigate('/user/dashboard');
    }
  }, [user, navigate]);

  const handleVerify = async (type) => {
    try {
      setLoading(true);
      setError('');
  
      const otp = type === 'email' ? emailOTP : phoneOTP;
      const payload = {
        otp,
        type,
        email: user?.email,
        phone: user?.phone
      };
  
      await axios.post('/api/auth/verify-otp', payload);
  
      setSuccess(prev => ({ ...prev, [type]: true }));
      if (success[type === 'email' ? 'phone' : 'email']) {
        navigate('/user/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };
  

  const handleResend = async (type) => {
    try {
      setLoading(true);
      setError('');
      await axios.post('/api/auth/resend-otp', { type });
      setSuccess(prev => ({ ...prev, [type]: false }));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-md mx-auto bg-white p-8 border border-gray-200 rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-8">Verify Your Account</h1>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Email Verification */}
          <div className={`p-6 border rounded-lg ${success.email ? 'border-green-500' : 'border-gray-200'}`}>
            <div className="flex items-center mb-4">
              <Mail className="w-6 h-6 mr-2" />
              <h2 className="text-lg font-semibold">Email Verification</h2>
            </div>
            
            {!success.email ? (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Enter the verification code sent to {user?.email}
                </p>
                <input
                  type="text"
                  maxLength={6}
                  value={emailOTP}
                  onChange={(e) => setEmailOTP(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
                  placeholder="Enter 6-digit code"
                />
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleVerify('email')}
                    disabled={loading || emailOTP.length !== 6}
                    className="flex-1 bg-black text-white py-2 rounded-md hover:bg-gray-800 disabled:bg-gray-300"
                  >
                    Verify Email
                  </button>
                  <button
                    onClick={() => handleResend('email')}
                    disabled={loading}
                    className="px-4 py-2 border border-black rounded-md hover:bg-gray-50"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <p className="text-green-500">Email verified successfully!</p>
            )}
          </div>

          {/* Phone Verification */}
          <div className={`p-6 border rounded-lg ${success.phone ? 'border-green-500' : 'border-gray-200'}`}>
            <div className="flex items-center mb-4">
              <Phone className="w-6 h-6 mr-2" />
              <h2 className="text-lg font-semibold">Phone Verification</h2>
            </div>
            
            {!success.phone ? (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Enter the verification code sent to {user?.phone}
                </p>
                <input
                  type="text"
                  maxLength={6}
                  value={phoneOTP}
                  onChange={(e) => setPhoneOTP(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
                  placeholder="Enter 6-digit code"
                />
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleVerify('phone')}
                    disabled={loading || phoneOTP.length !== 6}
                    className="flex-1 bg-black text-white py-2 rounded-md hover:bg-gray-800 disabled:bg-gray-300"
                  >
                    Verify Phone
                  </button>
                  <button
                    onClick={() => handleResend('phone')}
                    disabled={loading}
                    className="px-4 py-2 border border-black rounded-md hover:bg-gray-50"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <p className="text-green-500">Phone number verified successfully!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;