import React, { useState, useEffect } from 'react';
import { Route, Users, UserCheck, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const Routing = () => {
  const [users, setUsers] = useState([]);
  const [interviewers, setInterviewers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [routingRequirements, setRoutingRequirements] = useState({
    preferredLanguage: '',
    preferredTime: '',
    urgency: 'normal',
    specialNotes: ''
  });
  const [routingResult, setRoutingResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [routingHistory, setRoutingHistory] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersResponse, interviewersResponse, historyResponse] = await Promise.all([
        axios.get('/api/users?limit=100'),
        axios.get('/api/interviewers'),
        axios.get('/api/routing-history?limit=20')
      ]);
      
      setUsers(usersResponse.data.users);
      setInterviewers(interviewersResponse.data);
      setRoutingHistory(historyResponse.data.history);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
    const user = users.find(u => u.id === userId);
    if (user) {
      setRoutingRequirements({
        preferredLanguage: user.preferences.preferredLanguage,
        preferredTime: user.preferences.preferredTime,
        urgency: 'normal',
        specialNotes: user.preferences.specialNeeds || ''
      });
    }
  };

  const handleRouteUser = async () => {
    if (!selectedUser) {
      alert('Please select a user to route');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/route', {
        userId: selectedUser,
        requirements: routingRequirements
      });
      
      setRoutingResult(response.data);
      
      // Refresh data
      fetchData();
    } catch (error) {
      console.error('Error routing user:', error);
      alert('Error routing user: ' + error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  const getUrgencyLabel = (urgency) => {
    switch (urgency) {
      case 'high': return 'High Priority';
      case 'medium': return 'Medium Priority';
      default: return 'Normal Priority';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Live User Routing</h1>
        <p className="text-gray-600 mt-2">Dynamically route users to optimal interviewers in real-time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Routing Form */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Route User</h3>
            
            {/* User Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select User
              </label>
              <select
                value={selectedUser}
                onChange={(e) => handleUserSelect(e.target.value)}
                className="input-field"
              >
                <option value="">Choose a user...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} - {user.industry} - {user.demographic}
                  </option>
                ))}
              </select>
            </div>

            {/* Requirements */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Language
                </label>
                <select
                  value={routingRequirements.preferredLanguage}
                  onChange={(e) => setRoutingRequirements({
                    ...routingRequirements,
                    preferredLanguage: e.target.value
                  })}
                  className="input-field"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Time
                </label>
                <select
                  value={routingRequirements.preferredTime}
                  onChange={(e) => setRoutingRequirements({
                    ...routingRequirements,
                    preferredTime: e.target.value
                  })}
                  className="input-field"
                >
                  <option value="Morning">Morning (9 AM - 12 PM)</option>
                  <option value="Afternoon">Afternoon (12 PM - 5 PM)</option>
                  <option value="Evening">Evening (5 PM - 8 PM)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency Level
                </label>
                <select
                  value={routingRequirements.urgency}
                  onChange={(e) => setRoutingRequirements({
                    ...routingRequirements,
                    urgency: e.target.value
                  })}
                  className="input-field"
                >
                  <option value="normal">Normal</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Notes
                </label>
                <textarea
                  value={routingRequirements.specialNotes}
                  onChange={(e) => setRoutingRequirements({
                    ...routingRequirements,
                    specialNotes: e.target.value
                  })}
                  rows={3}
                  className="input-field"
                  placeholder="Any special requirements or notes..."
                />
              </div>
            </div>

            <button
              onClick={handleRouteUser}
              disabled={loading || !selectedUser}
              className="w-full btn-primary mt-6 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner mr-2"></div>
                  Routing...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Route className="h-4 w-4 mr-2" />
                  Route User
                </div>
              )}
            </button>
          </div>

          {/* Routing Result */}
          {routingResult && (
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Routing Result</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-800">Successfully Routed</span>
                  </div>
                  <span className="badge badge-success">
                    Score: {routingResult.routing.score?.toFixed(3) || 'N/A'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">User</label>
                    <p className="text-sm text-gray-900">{routingResult.user.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Interviewer</label>
                    <p className="text-sm text-gray-900">{routingResult.interviewer?.name || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Reason</label>
                  <p className="text-sm text-gray-900">{routingResult.routing.reason}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Timestamp</label>
                  <p className="text-sm text-gray-900">
                    {new Date(routingResult.routing.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* System Status and History */}
        <div className="space-y-6">
          {/* System Status */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Available Interviewers</span>
                <span className="badge badge-success">
                  {interviewers.filter(i => i.availability).length} / {interviewers.length}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Load</span>
                <span className="text-sm text-gray-900">
                  {interviewers.length > 0 
                    ? (interviewers.reduce((sum, i) => sum + i.currentLoad, 0) / interviewers.length).toFixed(1)
                    : 0
                  } / 8
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">System Health</span>
                <span className="badge badge-success">Optimal</span>
              </div>
            </div>
          </div>

          {/* Recent Routing History */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Routing History</h3>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {routingHistory.map((routing) => (
                <div key={routing.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">
                      {new Date(routing.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="badge badge-info">
                      {routing.score ? routing.score.toFixed(3) : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-900">
                    <p>User: {routing.userId.slice(0, 8)}...</p>
                    <p>Interviewer: {routing.interviewerId ? routing.interviewerId.slice(0, 8) + '...' : 'N/A'}</p>
                    <p className="text-gray-600 text-xs mt-1">{routing.reason}</p>
                  </div>
                </div>
              ))}
              
              {routingHistory.length === 0 && (
                <p className="text-gray-500 text-center py-4">No routing history available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Routing;
