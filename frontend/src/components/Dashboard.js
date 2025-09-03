import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  Clock, 
  DollarSign, 
  Route,
} from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentRoutings, setRecentRoutings] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, routingResponse] = await Promise.all([
        axios.get('/api/stats'),
        axios.get('/api/routing-history?limit=5')
      ]);
      
      setStats(statsResponse.data);
      setRecentRoutings(routingResponse.data.history);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your data routing system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          color="text-blue-600"
          subtitle="Registered users"
        />
        <StatCard
          title="Active Interviewers"
          value={stats?.activeInterviewers || 0}
          icon={UserCheck}
          color="text-green-600"
          subtitle={`of ${stats?.totalInterviewers || 0} total`}
        />
        <StatCard
          title="Avg Interview Time"
          value={`${stats?.averageInterviewTime || 0}m`}
          icon={Clock}
          color="text-purple-600"
          subtitle="Average duration"
        />
        <StatCard
          title="Avg Interview Cost"
          value={`$${stats?.averageInterviewCost || 0}`}
          icon={DollarSign}
          color="text-orange-600"
          subtitle="Per interview"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/routing')}
              className="w-full btn-primary flex items-center justify-center hover:bg-primary-700 transition-colors"
            >
              <Route className="h-4 w-4 mr-2" />
              Route New User
            </button>
            <button 
              onClick={() => navigate('/users')}
              className="w-full btn-secondary flex items-center justify-center hover:bg-gray-400 transition-colors"
            >
              <Users className="h-4 w-4 mr-2" />
              View All Users
            </button>
            <button 
              onClick={() => navigate('/interviewers')}
              className="w-full btn-secondary flex items-center justify-center hover:bg-gray-400 transition-colors"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Manage Interviewers
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Backend API</span>
              <span className="badge badge-success">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Python Microservice</span>
              <span className="badge badge-success">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="badge badge-success">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Update</span>
              <span className="text-sm text-gray-900">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Routing Activity</h3>
        {recentRoutings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interviewer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentRoutings.map((routing) => (
                  <tr key={routing.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(routing.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      User {routing.userId.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {routing.interviewerId ? `Interviewer ${routing.interviewerId.slice(0, 8)}...` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {routing.score ? routing.score.toFixed(3) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="badge badge-success">Completed</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No recent routing activity</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
