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
    interviewType: 'online', // 'online' or 'in-person'
    location: '',
    interviewLink: '',
    bufferTime: 15, // Buffer time between interviews in minutes
    availableSlots: []
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSlots, setSelectedSlots] = useState([]);

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
    // Form submission is now handled in handleCreateInterview after step 2
  };

  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM
    const totalSlotTime = formData.duration + formData.bufferTime;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += totalSlotTime) {
        if (hour + (minute + totalSlotTime) / 60 <= endHour) {
          // Convert to AM/PM format
          let displayHour = hour;
          let ampm = 'AM';
          
          if (hour === 12) {
            ampm = 'PM';
          } else if (hour > 12) {
            displayHour = hour - 12;
            ampm = 'PM';
          }
          
          const timeString = `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
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

  const generateWeekCalendar = () => {
    const today = new Date();
    const currentWeek = [];
    
    // Get the start of the current week (Monday)
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday
    startOfWeek.setDate(diff);
    
    // Generate 7 days starting from Monday
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      currentWeek.push(date);
    }
    
    return currentWeek;
  };

  const handleSlotClick = (date, time) => {
    const slotKey = `${date.toISOString().split('T')[0]}_${time}`;
    setSelectedSlots(prev => {
      if (prev.find(slot => slot.key === slotKey)) {
        return prev.filter(slot => slot.key !== slotKey);
      } else {
        return [...prev, { key: slotKey, date: date.toISOString().split('T')[0], time, selected: true }];
      }
    });
  };

  const isSlotSelected = (date, time) => {
    const slotKey = `${date.toISOString().split('T')[0]}_${time}`;
    return selectedSlots.find(slot => slot.key === slotKey);
  };

  const handleNextStep = () => {
    if (formData.title && formData.description) {
      setCurrentStep(2);
    }
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  const handleCreateInterview = async () => {
    if (selectedSlots.length === 0) {
      alert('Please select at least one time slot');
      return;
    }

    try {
      const interviewData = {
        ...formData,
        creatorId: user.uid,
        creatorName: user.displayName || user.email,
        createdAt: new Date().toISOString(),
        status: 'active',
        bookings: [],
        availableSlots: selectedSlots.map(slot => ({
          date: slot.date,
          time: slot.time,
          available: true,
          bookedBy: null
        }))
      };

      await addDoc(collection(db, 'interviews'), interviewData);
      setFormData({
        title: '',
        description: '',
        duration: 30,
        interviewType: 'online',
        location: '',
        interviewLink: '',
        bufferTime: 15,
        availableSlots: []
      });
      setSelectedSlots([]);
      setCurrentStep(1);
      setShowCreateForm(false);
      fetchInterviews();
    } catch (error) {
      console.error('Error creating interview:', error);
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to access interview scheduling</h2>
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Go to Homepage to Sign In
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
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 max-w-4xl mx-auto">
            {/* Step Indicator */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-4">
                <div className={`flex items-center ${currentStep >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 1 ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300'}`}>
                    1
                  </div>
                  <span className="ml-2 font-medium">Interview Details</span>
                </div>
                <div className="w-8 h-1 bg-gray-300"></div>
                <div className={`flex items-center ${currentStep >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 2 ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300'}`}>
                    2
                  </div>
                  <span className="ml-2 font-medium">Select Time Slots</span>
                </div>
              </div>
            </div>

            {currentStep === 1 ? (
              /* Step 1: Interview Details */
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Step 1: Interview Details</h3>
                
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <label htmlFor="bufferTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Buffer Time (minutes)
                    </label>
                    <select
                      id="bufferTime"
                      name="bufferTime"
                      value={formData.bufferTime}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value={0}>No buffer</option>
                      <option value={5}>5 minutes</option>
                      <option value={10}>10 minutes</option>
                      <option value={15}>15 minutes</option>
                      <option value={20}>20 minutes</option>
                      <option value={30}>30 minutes</option>
                    </select>
                  </div>
                </div>

                {/* Interview Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interview Type
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="interviewType"
                        value="online"
                        checked={formData.interviewType === 'online'}
                        onChange={handleChange}
                        className="mr-2 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">Online</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="interviewType"
                        value="in-person"
                        checked={formData.interviewType === 'in-person'}
                        onChange={handleChange}
                        className="mr-2 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">In-Person</span>
                    </label>
                  </div>
                </div>

                {/* Conditional Location/Link Field */}
                {formData.interviewType === 'online' ? (
                  <div>
                    <label htmlFor="interviewLink" className="block text-sm font-medium text-gray-700 mb-1">
                      Interview Link
                    </label>
                    <input
                      type="url"
                      id="interviewLink"
                      name="interviewLink"
                      value={formData.interviewLink}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., https://zoom.us/j/123456789, https://meet.google.com/abc-defg-hij"
                    />
                  </div>
                ) : (
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
                      placeholder="e.g., Room 123, Building A, 123 Main Street"
                    />
                  </div>
                )}

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!formData.title || !formData.description}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </form>
            ) : (
              /* Step 2: Time Slot Selection */
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Step 2: Select Time Slots</h3>
                
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Time Slot Information</h4>
                  <p className="text-sm text-blue-700">
                    Each slot is {formData.duration} minutes with {formData.bufferTime === 0 ? 'no' : `${formData.bufferTime} minutes`} buffer time.
                    Total time per slot: {formData.duration + formData.bufferTime} minutes.
                    Click on time slots to select them for your interview availability.
                  </p>
                </div>

                {/* Week Calendar Grid */}
                <div className="overflow-x-auto">
                  <div className="min-w-max">
                    {/* Header Row */}
                    <div className="grid grid-cols-8 gap-1 mb-2">
                      <div className="w-20 h-10"></div> {/* Empty corner */}
                      {generateWeekCalendar().map((date, index) => (
                        <div key={index} className="w-32 h-10 bg-gray-100 rounded flex items-center justify-center text-sm font-medium text-gray-700">
                          {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                      ))}
                    </div>

                    {/* Time Slots */}
                    {generateTimeSlots().map((slot, timeIndex) => (
                      <div key={timeIndex} className="grid grid-cols-8 gap-1 mb-1">
                        <div className="w-20 h-8 flex items-center justify-center text-xs text-gray-600 font-medium">
                          {slot.time}
                        </div>
                        {generateWeekCalendar().map((date, dateIndex) => {
                          const isSelected = isSlotSelected(date, slot.time);
                          return (
                            <button
                              key={dateIndex}
                              onClick={() => handleSlotClick(date, slot.time)}
                              className={`w-32 h-8 rounded border-2 transition-all ${
                                isSelected
                                  ? 'bg-green-500 border-green-600 text-white'
                                  : 'bg-white border-gray-200 hover:bg-green-50 hover:border-green-300'
                              }`}
                            >
                              {isSelected ? '✓' : ''}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Selected slots: <span className="font-medium text-green-600">{selectedSlots.length}</span>
                  </p>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={handleBackToStep1}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateInterview}
                    disabled={selectedSlots.length === 0}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Interview
                  </button>
                </div>
              </div>
            )}
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
                        <span>Buffer Time: {interview.bufferTime === 0 ? 'None' : `${interview.bufferTime} minutes`}</span>
                        <span>Created: {new Date(interview.createdAt).toLocaleDateString()}</span>
                        <span>Type: {interview.interviewType === 'online' ? 'Online' : 'In-Person'}</span>
                        {interview.interviewType === 'online' && interview.interviewLink && (
                          <span>Link: <a href={interview.interviewLink} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">{interview.interviewLink}</a></span>
                        )}
                        {interview.interviewType === 'in-person' && interview.location && (
                          <span>Location: {interview.location}</span>
                        )}
                      </div>
                      <div className="mt-3">
                        <span className="text-sm text-gray-500">
                          Total Time per Slot: {interview.duration + interview.bufferTime} minutes
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
