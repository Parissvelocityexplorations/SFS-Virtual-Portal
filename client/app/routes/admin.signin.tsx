import React, { useState } from 'react';
import { Form, useNavigate } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: "Admin Sign In - Space Force Visitor Management" },
    { name: "description", content: "Sign in to the Space Force Visitor Management admin panel" },
  ];
};

export default function AdminSignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    // For demo purposes, use a simple credential check
    // In a real app, this would make an API call for authentication
    if (username === 'admin' && password === 'spaceforce') {
      // Set a flag in localStorage to indicate authentication
      localStorage.setItem('sfAdminAuth', 'true');
      navigate('/admin/appointments');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="m-auto w-full max-w-md">
        <div className="bg-white py-8 px-10 shadow rounded-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Sign In</h2>
            <p className="mt-2 text-gray-600">Sign in to access the Space Force Visitor Management admin panel</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
          )}
          
          <Form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Sign In
              </button>
            </div>
          </Form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              For demo: username "admin" and password "spaceforce"
            </p>
          </div>
        </div>
        
        <div className="text-center mt-4">
          <a
            href="/"
            className="text-sm font-medium text-primary hover:text-opacity-90"
          >
            Return to Visitor Portal
          </a>
        </div>
      </div>
    </div>
  );
}