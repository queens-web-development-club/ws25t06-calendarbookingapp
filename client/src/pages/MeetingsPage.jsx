import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

const MeetingsPage = () => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 60,
    maxParticipants: 10,
    deadline: ''
  });

  useEffect(() => {
    if (user) {
      fetchMeetings();
    }
  }, [user]);

  const fetchMeetings = async () => {
    try {
      const meetingsRef = collection(db, 'meetings');
      const q = query(meetingsRef, where('creatorId', '==', user.uid), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const meetingsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMeetings(meetingsList);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const meetingData = {
        ...formData,
        creatorId: user.uid,
        creatorName: user.displayName || user.email,
        createdAt: new Date().toISOString(),
        status: 'active',
        participants: [],
        responses: []
      };

      await addDoc(collection(db, 'meetings'), meetingData);
      setFormData({
        title: '',
        description: '',
        duration: 60,
        maxParticipants: 10,
        deadline: ''
      });
      setShowCreateForm(false);
      fetchMeetings();
    } catch (error) {
      console.error('Error creating meeting:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to access team meetings</h2>
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Team Meeting Scheduler
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create team meetings and find the perfect time that works for everyone. 
            Just like LettuceMeet, but better integrated with QWeb's workflow.
          </p>
        </div>

        {/* Create Meeting Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors shadow-lg"
          >
            {showCreateForm ? 'Cancel' : 'Create New Meeting'}
          </button>
        </div>

        {/* Create Meeting Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Create New Team Meeting</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter meeting title"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the meeting purpose and agenda"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <select
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-1">
                    Max Participants
                  </label>
                  <input
                    type="number"
                    id="maxParticipants"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleChange}
                    min="2"
                    max="50"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                    Response Deadline
                  </label>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Create Meeting
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Meetings List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Your Team Meetings</h3>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading meetings...</p>
            </div>
          ) : meetings.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No meetings yet</h4>
              <p className="text-gray-600 mb-4">Create your first team meeting to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {meetings.map((meeting) => (
                <div key={meeting.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{meeting.title}</h4>
                      {meeting.description && (
                        <p className="text-gray-600 mb-3">{meeting.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span>Duration: {meeting.duration} minutes</span>
                        <span>Max Participants: {meeting.maxParticipants}</span>
                        <span>Created: {new Date(meeting.createdAt).toLocaleDateString()}</span>
                        {meeting.deadline && (
                          <span>Deadline: {new Date(meeting.deadline).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/meetings/${meeting.id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingsPage;
