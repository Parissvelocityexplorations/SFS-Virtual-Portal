import React from 'react';
import { Link } from '@remix-run/react';
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Space Force Visitor Portal" },
    { name: "description", content: "Welcome to the Space Force Visitor Portal" },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-primary text-white p-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Space Force Visitor Portal</h1>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center justify-center hover:shadow-lg transition-shadow">
            <div className="bg-primary bg-opacity-10 p-5 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-primary mb-4">Visitor Kiosk</h2>
            <p className="text-gray-600 text-center mb-8">
              Schedule appointments and request passes for base access
            </p>
            <Link
              to="/kiosk"
              className="bg-primary hover:bg-opacity-90 text-white py-3 px-8 rounded-lg font-semibold transition-all transform hover:-translate-y-1"
            >
              Start Here
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center justify-center hover:shadow-lg transition-shadow">
            <div className="bg-secondary bg-opacity-10 p-5 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-secondary mb-4">Admin Portal</h2>
            <p className="text-gray-600 text-center mb-8">
              Manage visitor appointments and monitor queue status
            </p>
            <Link
              to="/admin/signin"
              className="bg-secondary hover:bg-opacity-90 text-white py-3 px-8 rounded-lg font-semibold transition-all transform hover:-translate-y-1"
            >
              Sign In
            </Link>
          </div>
        </div>
        
        <div className="mt-12 bg-white rounded-xl shadow-md p-8 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Visitor Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 p-5 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Base Access Hours</h3>
              <p className="text-gray-600">Monday - Friday: 7:30 a.m. to 3 p.m.</p>
              <p className="text-gray-600">Saturday & Sunday: Closed</p>
            </div>
            
            <div className="border border-gray-200 p-5 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Required Documents</h3>
              <p className="text-gray-600">Valid photo ID</p>
              <p className="text-gray-600">Appointment confirmation</p>
              <p className="text-gray-600">Service-specific documentation</p>
            </div>
            
            <div className="border border-gray-200 p-5 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Contact Information</h3>
              <p className="text-gray-600">Visitor Control Center</p>
              <p className="text-gray-600">Phone: (555) 123-4567</p>
              <p className="text-gray-600">Email: vcc@spaceforce.mil</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white p-6">
        <div className="container mx-auto">
          <div className="text-center">
            <p>Space Force Visitor Management Portal</p>
            <p className="text-sm text-gray-400 mt-2">© {new Date().getFullYear()} United States Space Force. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
