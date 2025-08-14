import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

const InterviewsPage = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 30,
    location: '',
    maxBookings: 5,
    availableSlots: []
  });

  useEffect(() => {
    if (user) {
      fetchInterviews();
    }
  }, [user]);

  const fetchInterviews = async () => {
    try {
      const interviewsRef = collection(db, 'interviews');
      const q = query(interviewsRef, where('creatorId', '==', user.uid), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const interviewsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setInterviews(interviewsList);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const interviewData = {
        ...formData,
        creatorId: user.uid,
        creatorName: user.displayName || user.email,
        createdAt: new Date().toISOString(),
        status: 'active',
        bookings: [],
        availableSlots: generateTimeSlots()
      };

      await addDoc(collection(db, 'interviews'), interviewData);
      setFormData({
        title: '',
        description: '',
        duration: 30,
        location: '',
        maxBookings: 5,
        availableSlots: []
      });
      setShowCreateForm(false);
      fetchInterviews();
    } catch (error) {
      console.error('Error creating interview:', error);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM
    const slotDuration = formData.duration;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        if (hour + (minute + slotDuration) / 60 <= endHour) {
          const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          slots.push({
            time: timeString,
            available: true,
            bookedBy: null
          });
        }
      }
    }
    return slots;
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to access interview scheduling</h2>
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
            Interview Scheduler
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create interview slots and let candidates book times that work for them. 
            Professional scheduling system similar to Calendly.
          </p>
        </div>

        {/* Create Interview Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors shadow-lg"
          >
            {showCreateForm ? 'Cancel' : 'Create Interview Slots'}
          </button>
        </div>

        {/* Create Interview Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Create New Interview Slots</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Interview Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Frontend Developer Interview"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Describe the interview process and requirements"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Zoom, Room 123, etc."
                  />
                </div>

                <div>
                  <label htmlFor="maxBookings" className="block text-sm font-medium text-gray-700 mb-1">
                    Max Bookings
                  </label>
                  <input
                    type="number"
                    id="maxBookings"
                    name="maxBookings"
                    value={formData.maxBookings}
                    onChange={handleChange}
                    min="1"
                    max="20"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Available Time Slots</h4>
                <p className="text-sm text-blue-700">
                  Time slots will be automatically generated from 9:00 AM to 5:00 PM based on your selected duration.
                  Candidates can book any available slot during business hours.
                </p>
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
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Create Interview Slots
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Interviews List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Your Interview Slots</h3>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading interviews...</p>
            </div>
          ) : interviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No interview slots yet</h4>
              <p className="text-gray-600 mb-4">Create your first interview slots to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {interviews.map((interview) => (
                <div key={interview.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{interview.title}</h4>
                      {interview.description && (
                        <p className="text-gray-600 mb-3">{interview.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span>Duration: {interview.duration} minutes</span>
                        <span>Max Bookings: {interview.maxBookings}</span>
                        <span>Created: {new Date(interview.createdAt).toLocaleDateString()}</span>
                        {interview.location && (
                          <span>Location: {interview.location}</span>
                        )}
                      </div>
                      <div className="mt-3">
                        <span className="text-sm text-gray-500">
                          Bookings: {interview.bookings?.length || 0} / {interview.maxBookings}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/interviews/${interview.id}`}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
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

export default InterviewsPage;
