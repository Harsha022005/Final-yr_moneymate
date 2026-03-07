import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function OAuthCallback() {
  const [status, setStatus] = useState('Processing authentication...');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract token from URL parameters
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // Save the token to localStorage
      localStorage.setItem('token', token);
      setStatus('Authentication successful! Redirecting...');
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate('/userdash');
      }, 1000);
    } else {
      setStatus('Authentication failed. No token received.');
      
      // Redirect to login after a delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  }, [navigate, location]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-4">
          OAuth Authentication
        </h2>
        
        <div className="text-center">
          <div className="mb-4">
            <div className="inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-700">{status}</p>
        </div>
      </div>
    </div>
  );
}

export default OAuthCallback;