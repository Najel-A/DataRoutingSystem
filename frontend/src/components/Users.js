import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Route } from 'lucide-react';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedTranscript, setSelectedTranscript] = useState(null);
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/users?page=${currentPage}&limit=20&search=${searchTerm}`);
      setUsers(response.data.users);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };

  const openUserModal = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  const UserModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
          <button
            onClick={closeUserModal}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {selectedUser && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="text-sm text-gray-900">{selectedUser.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-sm text-gray-900">{selectedUser.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <p className="text-sm text-gray-900">{selectedUser.age}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <p className="text-sm text-gray-900">{selectedUser.gender}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Demographic</label>
                <p className="text-sm text-gray-900">{selectedUser.demographic}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Education</label>
                <p className="text-sm text-gray-900">{selectedUser.education}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Industry</label>
                <p className="text-sm text-gray-900">{selectedUser.industry}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <p className="text-sm text-gray-900">
                  {selectedUser.location.city}, {selectedUser.location.state}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferences</label>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Language:</span> {selectedUser.preferences.preferredLanguage}
                </p>
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Time:</span> {selectedUser.preferences.preferredTime}
                </p>
                {selectedUser.preferences.specialNeeds && (
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">Special Needs:</span> {selectedUser.preferences.specialNeeds}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interview History</label>
              <div className="bg-gray-50 p-3 rounded-lg max-h-64 overflow-y-auto">
                {selectedUser.interviewHistory.map((interview, index) => (
                  <div key={interview.id} className="text-sm text-gray-900 mb-4 border-b border-gray-200 pb-3 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">
                          Interview {index + 1}: {new Date(interview.date).toLocaleDateString()}
                        </p>
                        <p className="text-gray-600">
                          {interview.duration}min • ${interview.cost} • Rating: {interview.rating}/5 • {interview.outcome}
                        </p>
                        <p className="text-gray-600">Interviewer: {interview.interviewer}</p>
                      </div>
                      {interview.transcript && (
                        <button
                          onClick={() => {
                            setSelectedTranscript(interview.transcript);
                            setShowTranscriptModal(true);
                          }}
                          className="text-primary-600 hover:text-primary-800 text-xs bg-primary-50 px-2 py-1 rounded"
                        >
                          View Transcript
                        </button>
                      )}
                    </div>
                    {interview.transcript && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">
                          <span className="font-medium">Type:</span> {interview.transcript.title}
                        </p>
                        <p className="text-xs text-gray-600">
                          {interview.transcript.summary}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={closeUserModal}
                className="btn-secondary"
              >
                Close
              </button>
              <button className="btn-primary flex items-center">
                <Route className="h-4 w-4 mr-2" />
                Route User
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const TranscriptModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Interview Transcript</h3>
          <button
            onClick={() => {
              setShowTranscriptModal(false);
              setSelectedTranscript(null);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {selectedTranscript && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-2">{selectedTranscript.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{selectedTranscript.summary}</p>
              <div className="flex space-x-4 text-xs text-gray-500">
                <span>Duration: {selectedTranscript.duration} minutes</span>
              </div>
            </div>

            <div>
              <h5 className="text-md font-medium text-gray-900 mb-3">Interview Content</h5>
              <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                  {selectedTranscript.content}
                </pre>
              </div>
            </div>

            <div>
              <h5 className="text-md font-medium text-gray-900 mb-3">Key Points</h5>
              <ul className="list-disc list-inside space-y-1">
                {selectedTranscript.keyPoints.map((point, index) => (
                  <li key={index} className="text-sm text-gray-700">{point}</li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="text-md font-medium text-gray-900 mb-3">Interviewer Notes</h5>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-800">{selectedTranscript.interviewerNotes}</p>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => {
                  setShowTranscriptModal(false);
                  setSelectedTranscript(null);
                }}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-600 mt-2">Manage and view user information</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
        <form onSubmit={handleSearch} className="flex space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name, email, or industry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Demographics
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Industry
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Interviews
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-700">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.age} years, {user.gender}</div>
                        <div className="text-sm text-gray-500">{user.demographic}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.industry}</div>
                        <div className="text-sm text-gray-500">{user.education}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.metadata.totalInterviews}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.metadata.averageInterviewTime}m
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${user.metadata.averageInterviewCost}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openUserModal(user)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Route className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="btn-secondary disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="btn-secondary disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{currentPage}</span> of{' '}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="btn-secondary disabled:opacity-50 rounded-l-md"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="btn-secondary disabled:opacity-50 rounded-r-md"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {showUserModal && <UserModal />}
      {showTranscriptModal && <TranscriptModal />}
    </div>
  );
};

export default Users;
