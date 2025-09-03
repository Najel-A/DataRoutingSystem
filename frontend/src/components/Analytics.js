import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, UserCheck, Clock, DollarSign, Activity } from 'lucide-react';
import axios from 'axios';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [interviewers, setInterviewers] = useState([]);
  const [routingHistory, setRoutingHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const [statsResponse, usersResponse, interviewersResponse, historyResponse] = await Promise.all([
        axios.get('/api/stats'),
        axios.get('/api/users?limit=1000'),
        axios.get('/api/interviewers'),
        axios.get('/api/routing-history?limit=1000')
      ]);
      
      setStats(statsResponse.data);
      setUsers(usersResponse.data.users);
      setInterviewers(interviewersResponse.data);
      setRoutingHistory(historyResponse.data.history);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const prepareDemographicsData = () => {
    const demographics = {};
    users.forEach(user => {
      demographics[user.demographic] = (demographics[user.demographic] || 0) + 1;
    });
    
    return Object.entries(demographics).map(([name, value]) => ({
      name,
      value,
      fill: getRandomColor()
    }));
  };

  const prepareIndustryData = () => {
    const industries = {};
    users.forEach(user => {
      industries[user.industry] = (industries[user.industry] || 0) + 1;
    });
    
    return Object.entries(industries).map(([name, value]) => ({
      name,
      users: value,
      fill: getRandomColor()
    }));
  };

  const prepareEducationData = () => {
    const education = {};
    users.forEach(user => {
      education[user.education] = (education[user.education] || 0) + 1;
    });
    
    return Object.entries(education).map(([name, value]) => ({
      name,
      users: value,
      fill: getRandomColor()
    }));
  };

  const prepareInterviewerPerformanceData = () => {
    return interviewers.map(interviewer => ({
      name: interviewer.name,
      rating: interviewer.rating,
      experience: interviewer.experience,
      costPerHour: interviewer.costPerHour,
      currentLoad: interviewer.currentLoad,
      maxLoad: interviewer.maxLoad,
      loadPercentage: (interviewer.currentLoad / interviewer.maxLoad) * 100
    }));
  };

  const prepareRoutingTrendsData = () => {
    const dailyRoutings = {};
    routingHistory.forEach(routing => {
      const date = new Date(routing.timestamp).toLocaleDateString();
      dailyRoutings[date] = (dailyRoutings[date] || 0) + 1;
    });
    
    return Object.entries(dailyRoutings)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .slice(-7)
      .map(([date, count]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        routings: count
      }));
  };

  const prepareCostAnalysisData = () => {
    const costRanges = {
      '0-100': 0,
      '101-150': 0,
      '151-200': 0,
      '201-250': 0,
      '250+': 0
    };
    
    users.forEach(user => {
      const cost = user.metadata.averageInterviewCost;
      if (cost <= 100) costRanges['0-100']++;
      else if (cost <= 150) costRanges['101-150']++;
      else if (cost <= 200) costRanges['151-200']++;
      else if (cost <= 250) costRanges['201-250']++;
      else costRanges['250+']++;
    });
    
    return Object.entries(costRanges).map(([range, count]) => ({
      range,
      users: count,
      fill: getRandomColor()
    }));
  };

  const getRandomColor = () => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
        <p className="text-gray-600 mt-2">Comprehensive data analysis and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <UserCheck className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Active Interviewers</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.activeInterviewers || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Interview Time</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.averageInterviewTime || 0}m</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Interview Cost</p>
              <p className="text-2xl font-bold text-gray-900">${stats?.averageInterviewCost || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Demographics Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Demographics Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={prepareDemographicsData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {prepareDemographicsData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Industry Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Industry Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={prepareIndustryData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Education Level Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Education Level Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={prepareEducationData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cost Analysis */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview Cost Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={prepareCostAnalysisData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interviewer Performance */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Interviewer Performance Overview</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={prepareInterviewerPerformanceData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="rating" fill="#3B82F6" name="Rating" />
            <Bar yAxisId="right" dataKey="loadPercentage" fill="#EF4444" name="Load %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Routing Trends */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Routing Trends (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={prepareRoutingTrendsData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="routings" stroke="#8B5CF6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-800">Top Performing Interviewer</span>
              <span className="text-sm text-blue-900">
                {interviewers.length > 0 
                  ? interviewers.reduce((best, current) => 
                      current.rating > best.rating ? current : best
                    ).name
                  : 'N/A'
                }
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-800">Most Available Interviewer</span>
              <span className="text-sm text-green-900">
                {interviewers.length > 0 
                  ? interviewers.reduce((best, current) => 
                      (current.maxLoad - current.currentLoad) > (best.maxLoad - best.currentLoad) ? current : best
                    ).name
                  : 'N/A'
                }
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium text-purple-800">Cost-Effective Option</span>
              <span className="text-sm text-purple-900">
                {interviewers.length > 0 
                  ? interviewers.reduce((best, current) => 
                      current.costPerHour < best.costPerHour ? current : best
                    ).name
                  : 'N/A'
                }
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Routing Success Rate</span>
              <span className="badge badge-success">98.5%</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Response Time</span>
              <span className="text-sm text-gray-900">~150ms</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">System Uptime</span>
              <span className="badge badge-success">99.9%</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Connections</span>
              <span className="text-sm text-gray-900">{routingHistory.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
