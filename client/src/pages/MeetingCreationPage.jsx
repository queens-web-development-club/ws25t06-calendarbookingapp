import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const MeetingCreationPage = () => {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 30,
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '17:00',
    meetingType: 'online',
    location: '',
    meetingLink: '',
    maxParticipants: 1
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [createdMeeting, setCreatedMeeting] = useState(null);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock meetings data
      const mockMeetings = [
        {
          id: 'meeting_1',
          title: 'Weekly Team Standup',
          description: 'Daily standup meeting for the development team',
          duration: 30,
          meetingType: 'online',
          meetingLink: 'https://meet.google.com/abc-defg-hij',
          location: null,
          startDate: '2024-01-15',
          endDate: '2024-01-19',
          startTime: '09:00',
          endTime: '17:00',
          maxParticipants: 10,
          created: '2024-01-10T10:00:00Z',
          bookings: [
            { id: 'booking_1', participant: 'john@example.com', date: '2024-01-15', time: '09:00', status: 'confirmed' },
            { id: 'booking_2', participant: 'sarah@example.com', date: '2024-01-16', time: '09:00', status: 'confirmed' }
          ]
        },
        {
          id: 'meeting_2',
          title: 'Project Review Meeting',
          description: 'Monthly project review and planning session',
          duration: 60,
          meetingType: 'in-person',
          meetingLink: null,
          location: 'Conference Room A, Floor 3',
          startDate: '2024-01-20',
          endDate: '2024-01-25',
          startTime: '14:00',
          endTime: '18:00',
          maxParticipants: 5,
          created: '2024-01-12T14:00:00Z',
          bookings: [
            { id: 'booking_3', participant: 'mike@example.com', date: '2024-01-20', time: '14:00', status: 'confirmed' }
          ]
        },
        {
          id: 'meeting_3',
          title: 'Client Consultation',
          description: 'Initial consultation with new client',
          duration: 45,
          meetingType: 'hybrid',
          meetingLink: 'https://zoom.us/j/123456789',
          location: 'Meeting Room B',
          startDate: '2024-01-22',
          endDate: '2024-01-26',
          startTime: '10:00',
          endTime: '16:00',
          maxParticipants: 3,
          created: '2024-01-14T09:00:00Z',
          bookings: []
        }
      ];
      
      setMeetings(mockMeetings);
    } catch (error) {
      console.error('Error fetching meetings:', error);
      setError('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.startDate || !formData.endDate) {
      setError('Please fill in all required fields');
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError('End date must be after start date');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create new meeting
      const newMeeting = {
        id: `meeting_${Date.now()}`,
        ...formData,
        created: new Date().toISOString(),
        bookings: []
      };

      setMeetings(prev => [newMeeting, ...prev]);
      setCreatedMeeting(newMeeting);
      setShowConfirmation(true);
      setShowCreateForm(false);
      
    } catch (error) {
      console.error('Error creating meeting:', error);
      setError('Failed to create meeting. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMeeting = async (meetingId) => {
    if (!window.confirm('Are you sure you want to delete this meeting? This action cannot be undone.')) {
      return;
    }

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMeetings(prev => prev.filter(meeting => meeting.id !== meetingId));
    } catch (error) {
      console.error('Error deleting meeting:', error);
      setError('Failed to delete meeting. Please try again.');
    }
  };

  const getBookingLink = (meetingId) => {
    return `${window.location.origin}/book-meeting/${meetingId}`;
  };

  const handleFinishMeeting = () => {
    // Reset form and close confirmation
    setFormData({
      title: '',
      description: '',
      duration: 30,
      startDate: '',
      endDate: '',
      startTime: '09:00',
      endTime: '17:00',
      meetingType: 'online',
      location: '',
      meetingLink: '',
      maxParticipants: 1
    });
    setShowConfirmation(false);
    setCreatedMeeting(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2">
              Meeting Management
            </h1>
            <p className="text-xl text-gray-600">
              Create and manage your meetings
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Create New Meeting
          </button>
        </div>

        {/* Create Meeting Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Create New Meeting</h2>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Meeting Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                      Meeting Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 hover:border-gray-400"
                      placeholder="Enter meeting title"
                    />
                  </div>

                  {/* Meeting Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 hover:border-gray-400"
                      placeholder="Describe the purpose and agenda of the meeting"
                    />
                  </div>

                  {/* Duration and Max Participants */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="duration" className="block text-sm font-semibold text-gray-700 mb-2">
                        Meeting Duration (minutes) *
                      </label>
                      <select
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 hover:border-gray-400"
                      >
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={45}>45 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={90}>1.5 hours</option>
                        <option value={120}>2 hours</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="maxParticipants" className="block text-sm font-semibold text-gray-700 mb-2">
                        Max Participants
                      </label>
                      <input
                        type="number"
                        id="maxParticipants"
                        name="maxParticipants"
                        value={formData.maxParticipants}
                        onChange={handleInputChange}
                        min="1"
                        max="50"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 hover:border-gray-400"
                      />
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 mb-2">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 hover:border-gray-400"
                      />
                    </div>

                    <div>
                      <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700 mb-2">
                        End Date *
                      </label>
                      <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        required
                        min={formData.startDate || new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 hover:border-gray-400"
                      />
                    </div>
                  </div>

                  {/* Time Range */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="startTime" className="block text-sm font-semibold text-gray-700 mb-2">
                        Available From *
                      </label>
                      <input
                        type="time"
                        id="startTime"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 hover:border-gray-400"
                      />
                    </div>

                    <div>
                      <label htmlFor="endTime" className="block text-sm font-semibold text-gray-700 mb-2">
                        Available Until *
                      </label>
                      <input
                        type="time"
                        id="endTime"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 hover:border-gray-400"
                      />
                    </div>
                  </div>

                  {/* Meeting Type */}
                  <div>
                    <label htmlFor="meetingType" className="block text-sm font-semibold text-gray-700 mb-2">
                      Meeting Type *
                    </label>
                    <select
                      id="meetingType"
                      name="meetingType"
                      value={formData.meetingType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 hover:border-gray-400"
                    >
                      <option value="online">Online Meeting</option>
                      <option value="in-person">In-Person Meeting</option>
                      <option value="hybrid">Hybrid Meeting</option>
                    </select>
                  </div>

                  {/* Location/Link Fields */}
                  {formData.meetingType === 'in-person' && (
                    <div>
                      <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                        Meeting Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 hover:border-gray-400"
                        placeholder="Enter meeting location"
                      />
                    </div>
                  )}

                  {(formData.meetingType === 'online' || formData.meetingType === 'hybrid') && (
                    <div>
                      <label htmlFor="meetingLink" className="block text-sm font-semibold text-gray-700 mb-2">
                        Meeting Link
                      </label>
                      <input
                        type="url"
                        id="meetingLink"
                        name="meetingLink"
                        value={formData.meetingLink}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 hover:border-gray-400"
                        placeholder="https://meet.google.com/..."
                      />
                    </div>
                  )}

                  {error && (
                    <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl">
                      <p className="text-sm text-red-800 font-medium">{error}</p>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-xl font-bold transition-all duration-200 disabled:cursor-not-allowed text-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                    >
                      {submitting ? 'Creating Meeting...' : 'Create Meeting'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="px-6 py-4 border border-gray-300 text-gray-700 rounded-xl font-semibold transition-all duration-200 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Meeting Creation Confirmation Modal */}
        {showConfirmation && createdMeeting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Meeting Created Successfully!</h2>
                  <button
                    onClick={handleFinishMeeting}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Success Message */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-green-800">Meeting Created Successfully!</h4>
                        <p className="text-sm text-green-700">Your team meeting is now available for members to book their availability.</p>
                      </div>
                    </div>
                  </div>

                  {/* Meeting Details */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Meeting Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Title</p>
                        <p className="font-medium text-gray-900">{createdMeeting.title}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Type</p>
                        <p className="font-medium text-gray-900 capitalize">{createdMeeting.meetingType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-medium text-gray-900">{createdMeeting.duration} minutes</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Max Participants</p>
                        <p className="font-medium text-gray-900">{createdMeeting.maxParticipants}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Date Range</p>
                        <p className="font-medium text-gray-900">
                          {formatDate(createdMeeting.startDate)} - {formatDate(createdMeeting.endDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Available Hours</p>
                        <p className="font-medium text-gray-900">
                          {createdMeeting.startTime} - {createdMeeting.endTime}
                        </p>
                      </div>
                      {createdMeeting.meetingType === 'online' && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-600">Meeting Link</p>
                          <p className="font-medium text-gray-900 break-all">{createdMeeting.meetingLink}</p>
                        </div>
                      )}
                      {createdMeeting.meetingType === 'in-person' && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-600">Location</p>
                          <p className="font-medium text-gray-900">{createdMeeting.location}</p>
                        </div>
                      )}
                      {createdMeeting.description && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-600">Description</p>
                          <p className="font-medium text-gray-900">{createdMeeting.description}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Team Availability Booking */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Team Availability Booking</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Share this link with your team members so they can indicate their availability for the selected time slots:
                    </p>
                    
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2">
                        <code className="text-sm text-gray-800 break-all">
                          {getBookingLink(createdMeeting.id)}
                        </code>
                      </div>
                      <button
                        onClick={() => {
                          copyToClipboard(getBookingLink(createdMeeting.id));
                          alert('Team booking link copied to clipboard!');
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Copy Link</span>
                      </button>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h5 className="text-sm font-medium text-blue-800 mb-2">Preview the Team Booking Page</h5>
                      <p className="text-sm text-blue-700 mb-3">
                        This is where team members will select their available time slots for coordination.
                      </p>
                      
                      {/* Localhost Preview Info */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                        <p className="text-xs text-yellow-800">
                          <strong>Local Development:</strong> To preview this team booking page in localhost, 
                          use: <code className="bg-yellow-100 px-1 rounded">http://localhost:5173/book-meeting/{createdMeeting.id}</code>
                        </p>
                      </div>
                      
                      <a
                        href={getBookingLink(createdMeeting.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Open Team Booking Page
                      </a>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={handleFinishMeeting}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Create Another Meeting
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Meetings List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {meetings.map((meeting) => (
            <div key={meeting.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">{meeting.title}</h3>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => copyToClipboard(getBookingLink(meeting.id))}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Copy booking link"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteMeeting(meeting.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete meeting"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <p className="text-sm text-gray-600">{meeting.description}</p>
                
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {meeting.duration} minutes
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(meeting.startDate)} - {formatDate(meeting.endDate)}
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {meeting.bookings.length} / {meeting.maxParticipants} participants
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                  </svg>
                  {meeting.meetingType} meeting
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Created {formatDate(meeting.created)}
                  </span>
                  <button
                    onClick={() => navigate(`/book-meeting/${meeting.id}`)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors"
                  >
                    View Booking Page →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {meetings.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No meetings yet</h3>
            <p className="text-gray-600 mb-6">Create your first meeting to get started</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Create Meeting
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingCreationPage;
