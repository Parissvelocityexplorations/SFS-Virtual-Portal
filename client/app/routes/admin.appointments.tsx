import React, { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import axios from 'axios';

export const meta: MetaFunction = () => {
  return [
    { title: "Admin Panel - Appointment Queue" },
    { name: "description", content: "Admin panel for tracking appointment queues" },
  ];
};

interface Appointment {
  id: string;
  userId: string;
  date: string;
  status: number;
  passType: number;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNo: string;
  };
}

interface StatusBadgeProps {
  status: number;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let badgeColor = "bg-gray-100 text-gray-800";
  let statusText = "Unknown";
  
  switch(status) {
    case 0:
      badgeColor = "bg-blue-100 text-blue-800";
      statusText = "Scheduled";
      break;
    case 1:
      badgeColor = "bg-yellow-100 text-yellow-800";
      statusText = "Checked In";
      break;
    case 2:
      badgeColor = "bg-purple-100 text-purple-800";
      statusText = "Serving";
      break;
    case 3:
      badgeColor = "bg-green-100 text-green-800";
      statusText = "Served";
      break;
    case 4:
      badgeColor = "bg-red-100 text-red-800";
      statusText = "Cancelled";
      break;
    default:
      break;
  }
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeColor}`}>
      {statusText}
    </span>
  );
};

interface PassTypeBadgeProps {
  passType: number;
}

const PassTypeBadge: React.FC<PassTypeBadgeProps> = ({ passType }) => {
  let badgeColor = "bg-gray-100 text-gray-800";
  let passTypeText = "Unknown";
  
  switch(passType) {
    case 0:
      badgeColor = "bg-green-100 text-green-800";
      passTypeText = "Golf Pass";
      break;
    case 1:
      badgeColor = "bg-blue-100 text-blue-800";
      passTypeText = "Visitor Pass";
      break;
    case 2:
      badgeColor = "bg-purple-100 text-purple-800";
      passTypeText = "Vet Card";
      break;
    case 3:
      badgeColor = "bg-orange-100 text-orange-800";
      passTypeText = "Contractor";
      break;
    default:
      break;
  }
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeColor}`}>
      {passTypeText}
    </span>
  );
};

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [statusFilter, setStatusFilter] = useState<number[]>([0, 1, 2]); // Default to active appointments

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate, statusFilter]);


  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    
    const apiUrl = `/api/appointments/filter`;
    const params = {
      startDate: selectedDate,
      endDate: selectedDate,
      statuses: statusFilter
    };
    
    console.log(`💡💡 DEBUG - Fetching from: ${apiUrl}`);
    console.log(`💡💡 DEBUG - With params:`, params);
    
    try {
      // Make API call to get filtered appointments
      console.log(`💡💡 DEBUG - Making axios GET request`);
      const startTime = new Date();
      const response = await axios.get(apiUrl, { params });
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      
      console.log(`💡💡 DEBUG - API Request completed in ${duration}ms`);
      console.log(`💡💡 DEBUG - API Response status:`, response.status);
      console.log(`💡💡 DEBUG - API Response headers:`, response.headers);
      console.log(`💡💡 DEBUG - API Response data:`, response.data);
      
      if (Array.isArray(response.data)) {
        console.log(`Found ${response.data.length} matching appointments`);
        setAppointments(response.data);
      } else {
        console.error('Unexpected API response format:', response.data);
        setError('API returned unexpected data format');
        setAppointments([]);
      }
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
      
      let errorMessage = 'Failed to fetch appointments. Please try again.';
      
      if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Network error: The API service is not available.';
      } else if (err.response && err.response.status === 404) {
        errorMessage = 'The API endpoint for appointments was not found.';
      } else if (err.response) {
        errorMessage = `API Error: ${err.response.status} - ${JSON.stringify(err.response.data)}`;
      }
      
      console.error('Error details:', errorMessage);
      setError(errorMessage);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: number) => {
    try {
      console.log(`💡💡 DEBUG - Updating appointment status: ${appointmentId} to ${newStatus}`);
      
      // Make actual API call to update status
      const startTime = new Date();
      const response = await axios.put(`/api/appointments/${appointmentId}/status/${newStatus}`);
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      
      console.log(`💡💡 DEBUG - API Request completed in ${duration}ms`);
      console.log(`💡💡 DEBUG - API Response status:`, response.status);
      console.log(`Successfully updated appointment ${appointmentId} status to ${newStatus}`);
      
      // Update local state to reflect the change
      setAppointments(appointments.map(appt => 
        appt.id === appointmentId ? { ...appt, status: newStatus } : appt
      ));
    } catch (err) {
      console.error('Failed to update appointment status:', err);
      
      let errorMessage = 'Failed to update appointment status. Please try again.';
      
      if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Network error: The API service is not available. Please try again when the connection is restored.';
      } else if (err.response) {
        errorMessage = `API Error: ${err.response.status} - ${JSON.stringify(err.response.data)}`;
      }
      
      console.error('Error details:', errorMessage);
      alert(errorMessage);
      
      // Refresh the appointments to ensure UI is in sync with actual data
      fetchAppointments();
    }
  };

  const getQueueNumber = (index: number) => {
    return index + 1;
  };

  const handleStatusFilterChange = (status: number) => {
    if (statusFilter.includes(status)) {
      setStatusFilter(statusFilter.filter(s => s !== status));
    } else {
      setStatusFilter([...statusFilter, status]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl text-white font-bold">Space Force Admin</h1>
          <div className="flex space-x-4">
            <Link to="/admin/appointments" className="px-3 py-2 bg-white text-primary rounded-md">
              Appointments
            </Link>
            <Link to="/admin/users" className="px-3 py-2 hover:bg-opacity-80 bg-opacity-20 bg-white rounded-md">
              Users
            </Link>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-6 px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Appointment Queue</h2>
          
          <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Select Date
              </label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <p className="block text-sm font-medium text-gray-700 mb-1">Status Filter</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleStatusFilterChange(0)}
                  className={`px-3 py-1 rounded-md text-sm ${statusFilter.includes(0) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  Scheduled
                </button>
                <button
                  onClick={() => handleStatusFilterChange(1)}
                  className={`px-3 py-1 rounded-md text-sm ${statusFilter.includes(1) ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
                >
                  Checked In
                </button>
                <button
                  onClick={() => handleStatusFilterChange(2)}
                  className={`px-3 py-1 rounded-md text-sm ${statusFilter.includes(2) ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
                >
                  Serving
                </button>
                <button
                  onClick={() => handleStatusFilterChange(3)}
                  className={`px-3 py-1 rounded-md text-sm ${statusFilter.includes(3) ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                >
                  Served
                </button>
                <button
                  onClick={() => handleStatusFilterChange(4)}
                  className={`px-3 py-1 rounded-md text-sm ${statusFilter.includes(4) ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                >
                  Cancelled
                </button>
              </div>
            </div>
            
            <button
              onClick={fetchAppointments}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
            >
              Refresh
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : error ? (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-6">
              <div className="flex items-center">
                <svg className="h-6 w-6 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span className="font-medium">Error:</span> 
                <span className="ml-2">{error}</span>
              </div>
              <p className="mt-2 text-sm">Please check the API connection or try again later.</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>No appointments found for the selected date and status.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Queue #
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pass Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((appointment, index) => (
                    <tr key={appointment.id} className={appointment.status === 1 ? 'bg-yellow-50' : (appointment.status === 2 ? 'bg-purple-50' : '')}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-primary text-white rounded-full flex items-center justify-center font-medium">
                            {getQueueNumber(index)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.user?.firstName} {appointment.user?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{appointment.user?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <PassTypeBadge passType={appointment.passType} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={appointment.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {appointment.status === 0 && (
                            <button
                              onClick={() => updateAppointmentStatus(appointment.id, 1)}
                              className="text-yellow-600 hover:text-yellow-900 bg-yellow-100 px-2 py-1 rounded"
                            >
                              Check In
                            </button>
                          )}
                          {appointment.status === 1 && (
                            <button
                              onClick={() => updateAppointmentStatus(appointment.id, 2)}
                              className="text-purple-600 hover:text-purple-900 bg-purple-100 px-2 py-1 rounded"
                            >
                              Start Serving
                            </button>
                          )}
                          {appointment.status === 2 && (
                            <button
                              onClick={() => updateAppointmentStatus(appointment.id, 3)}
                              className="text-green-600 hover:text-green-900 bg-green-100 px-2 py-1 rounded"
                            >
                              Complete
                            </button>
                          )}
                          {(appointment.status === 0 || appointment.status === 1 || appointment.status === 2) && (
                            <button
                              onClick={() => updateAppointmentStatus(appointment.id, 4)}
                              className="text-red-600 hover:text-red-900 bg-red-100 px-2 py-1 rounded"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Queue Status</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="text-blue-800 font-medium">Scheduled</h3>
              <p className="text-2xl font-bold text-blue-700">
                {appointments.filter(a => a.status === 0).length}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h3 className="text-yellow-800 font-medium">Checked In</h3>
              <p className="text-2xl font-bold text-yellow-700">
                {appointments.filter(a => a.status === 1).length}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="text-purple-800 font-medium">Serving</h3>
              <p className="text-2xl font-bold text-purple-700">
                {appointments.filter(a => a.status === 2).length}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="text-green-800 font-medium">Served Today</h3>
              <p className="text-2xl font-bold text-green-700">
                {appointments.filter(a => a.status === 3).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}