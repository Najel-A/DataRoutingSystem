import React, { useState, useEffect } from 'react';
import { UserCheck, Star, Clock, DollarSign, TrendingUp, Filter } from 'lucide-react';
import axios from 'axios';

const Interviewers = () => {
  const [interviewers, setInterviewers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterSpecialization, setFilterSpecialization] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchInterviewers();
  }, []);

  const fetchInterviewers = async () => {
    try {
      const response = await axios.get('/api/interviewers');
      setInterviewers(response.data);
    } catch (error) {
      console.error('Error fetching interviewers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAndSortedInterviewers = () => {
    let filtered = interviewers;

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(i => i.type === filterType);
    }

    // Apply specialization filter
    if (filterSpecialization !== 'all') {
      filtered = filtered.filter(i => i.specialization === filterSpecialization);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'experience':
          return b.experience - a.experience;
        case 'load':
          return a.currentLoad - b.currentLoad;
        case 'cost':
          return a.costPerHour - b.costPerHour;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getAvailabilityBadge = (interviewer) => {
    if (!interviewer.availability) {
      return <span className="badge badge-error">Unavailable</span>;
    }
    
    const loadRatio = interviewer.currentLoad / interviewer.maxLoad;
    if (loadRatio >= 0.8) {
      return <span className="badge badge-warning">High Load</span>;
    } else if (loadRatio >= 0.5) {
      return <span className="badge badge-info">Moderate Load</span>;
    } else {
      return <span className="badge badge-success">Available</span>;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Senior': return 'text-purple-600 bg-purple-100';
      case 'Junior': return 'text-blue-600 bg-blue-100';
      case 'Specialist': return 'text-green-600 bg-green-100';
      case 'General': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSpecializationColor = (specialization) => {
    switch (specialization) {
      case 'Technical': return 'text-blue-600 bg-blue-100';
      case 'Behavioral': return 'text-green-600 bg-green-100';
      case 'Cultural': return 'text-purple-600 bg-purple-100';
      case 'Leadership': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredInterviewers = getFilteredAndSortedInterviewers();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Interviewers</h1>
        <p className="text-gray-600 mt-2">Manage and monitor interviewer performance and availability</p>
      </div>

      {/* Filters and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <UserCheck className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Interviewers</p>
              <p className="text-2xl font-bold text-gray-900">{interviewers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-gray-900">
                {interviewers.filter(i => i.availability).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Experience</p>
              <p className="text-2xl font-bold text-gray-900">
                {interviewers.length > 0 
                  ? Math.round(interviewers.reduce((sum, i) => sum + i.experience, 0) / interviewers.length)
                  : 0
                } years
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Cost/Hour</p>
              <p className="text-2xl font-bold text-gray-900">
                ${interviewers.length > 0 
                  ? Math.round(interviewers.reduce((sum, i) => sum + i.costPerHour, 0) / interviewers.length)
                  : 0
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value="Senior">Senior</option>
              <option value="Junior">Junior</option>
              <option value="Specialist">Specialist</option>
              <option value="General">General</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
            <select
              value={filterSpecialization}
              onChange={(e) => setFilterSpecialization(e.target.value)}
              className="input-field"
            >
              <option value="all">All Specializations</option>
              <option value="Technical">Technical</option>
              <option value="Behavioral">Behavioral</option>
              <option value="Cultural">Cultural</option>
              <option value="Leadership">Leadership</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
            >
              <option value="name">Name</option>
              <option value="rating">Rating</option>
              <option value="experience">Experience</option>
              <option value="load">Current Load</option>
              <option value="cost">Cost per Hour</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterType('all');
                setFilterSpecialization('all');
                setSortBy('name');
              }}
              className="btn-secondary w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Interviewers Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interviewer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Specialization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience & Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Load & Availability
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost & Languages
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInterviewers.map((interviewer) => (
                  <tr key={interviewer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-700">
                            {interviewer.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{interviewer.name}</div>
                          <div className="text-sm text-gray-500">ID: {interviewer.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        <span className={`badge ${getTypeColor(interviewer.type)}`}>
                          {interviewer.type}
                        </span>
                        <span className={`badge ${getSpecializationColor(interviewer.specialization)}`}>
                          {interviewer.specialization}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <span className="mr-2">{interviewer.experience} years</span>
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="ml-1">{interviewer.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        {getAvailabilityBadge(interviewer)}
                        <div className="text-sm text-gray-900">
                          {interviewer.currentLoad} / {interviewer.maxLoad} interviews
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${(interviewer.currentLoad / interviewer.maxLoad) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">${interviewer.costPerHour}/hr</div>
                        <div className="text-gray-500">
                          {interviewer.languages.join(', ')}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {filteredInterviewers.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No interviewers match the current filters</p>
        </div>
      )}
    </div>
  );
};

export default Interviewers;
