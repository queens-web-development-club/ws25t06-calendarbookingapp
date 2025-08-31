import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { generateTimeSlots, calculateTotalSlotTime } from '../utils/timeSlots';
import LoadingSpinner from '../components/LoadingSpinner';
import EventList from '../components/EventList';

const InterviewsPage = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const initialFormData = {
    title: '',
    description: '',
    duration: 30,
    interviewType: 'online', // 'online' or 'in-person'
    location: '',
    interviewLink: '',
    bufferTime: 15, // Buffer time between interviews in minutes
    startHour: 9, // Start hour for business hours
    endHour: 17, // End hour for business hours
    availableSlots: []
  };

  const [formData, setFormData] = useState(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [createdInterview, setCreatedInterview] = useState(null);

  useEffect(() => {
    if (user) {
      fetchInterviews();
    }
  }, [user]);

  // Global mouse up handler for drag operations
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setDragStart(null);
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  const fetchInterviews = async () => {
    try {
      console.log('Fetching interviews for user:', user);
      
      // First, let's try without organizerEmail to see all interviews
      const response = await fetch('http://localhost:3000/interviews');
      if (!response.ok) {
        throw new Error('Failed to fetch interviews');
      }
      const data = await response.json();
      console.log('Fetched interviews data:', data);
      setInterviews(data.interviews || []);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseInterview = async (event) => {
    if (!window.confirm(`Are you sure you want to close "${event.title}"? This will prevent new bookings.`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/interviews/${event.id}/close`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to close interview');
      }

      const result = await response.json();
      console.log('Interview closed successfully:', result);

      // Update the local state to reflect the change
      setInterviews(prevInterviews => 
        prevInterviews.map(interview => 
          interview.id === event.id 
            ? { ...interview, status: 'closed' }
            : interview
        )
      );

      alert('Interview closed successfully!');
    } catch (error) {
      console.error('Error closing interview:', error);
      alert(`Failed to close interview: ${error.message}`);
    }
  };

  const handleDeleteInterview = async (event) => {
    if (!window.confirm(`Are you sure you want to delete "${event.title}"? This action cannot be undone and will remove all related data.`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/interviews/${event.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete interview');
      }

      const result = await response.json();
      console.log('Interview deleted successfully:', result);

      // Remove the interview from local state
      setInterviews(prevInterviews => 
        prevInterviews.filter(interview => interview.id !== event.id)
      );

      alert('Interview deleted successfully!');
    } catch (error) {
      console.error('Error deleting interview:', error);
      alert(`Failed to delete interview: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Form submission is now handled in handleCreateInterview after step 2
  };

  // Time slots are now generated using the utility function with custom business hours
  const getTimeSlots = () => {
    return generateTimeSlots(formData.duration, formData.bufferTime, formData.startHour, formData.endHour);
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

  const handleMouseDown = (date, time) => {
    setIsDragging(true);
    setDragStart({ date, time });
    handleSlotClick(date, time);
  };

  const handleMouseEnter = (date, time) => {
    if (isDragging && dragStart) {
      // Only allow dragging within the same day
      if (date.toISOString().split('T')[0] === dragStart.date.toISOString().split('T')[0]) {
        // Get all time slots to find the range
        const timeSlots = getTimeSlots();
        const startIndex = timeSlots.findIndex(slot => slot.time === dragStart.time);
        const currentIndex = timeSlots.findIndex(slot => slot.time === time);
        
        if (startIndex !== -1 && currentIndex !== -1) {
          const minIndex = Math.min(startIndex, currentIndex);
          const maxIndex = Math.max(startIndex, currentIndex);
          
          // Clear existing selections for this day
          setSelectedSlots(prev => prev.filter(slot => slot.date !== date.toISOString().split('T')[0]));
          
          // Add all slots in the range for this day
          for (let i = minIndex; i <= maxIndex; i++) {
            const slot = timeSlots[i];
            const slotKey = `${date.toISOString().split('T')[0]}_${slot.time}`;
            setSelectedSlots(prev => [...prev, { 
              key: slotKey, 
              date: date.toISOString().split('T')[0], 
              time: slot.time, 
              selected: true 
            }]);
          }
        }
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  const handleNextStep = () => {
    if (formData.title && formData.description) {
      setCurrentStep(2);
    }
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  const handleFinishInterview = () => {
    // Reset form and go back to step 1
    setFormData({
      title: '',
      description: '',
      duration: 30,
      interviewType: 'online',
      location: '',
      interviewLink: '',
      bufferTime: 15,
      startHour: 9,
      endHour: 17,
      availableSlots: []
    });
    setSelectedSlots([]);
    setCurrentStep(1);
    setShowCreateForm(false);
    setCreatedInterview(null);
  };

  const handleCreateInterview = async () => {
    console.log('handleCreateInterview called');
    console.log('selectedSlots:', selectedSlots);
    console.log('formData:', formData);
    
    if (selectedSlots.length === 0) {
      console.log('No slots selected, showing alert');
      alert('Please select at least one time slot');
      return;
    }

    try {
      console.log('Starting API call...');
      const interviewData = {
        title: formData.title,
        description: formData.description,
        duration: formData.duration,
        location: formData.interviewType === 'in-person' ? formData.location : formData.interviewLink,
        organizerEmail: "",
        organizerName: "",
        interviewType: formData.interviewType,
        bufferTime: formData.bufferTime,
        startHour: formData.startHour,
        endHour: formData.endHour,
        availableSlots: selectedSlots.map(slot => ({
          date: slot.date,
          time: slot.time,
          duration: formData.duration,
          bufferTime: formData.bufferTime
        }))
      };

      console.log('Sending interview data:', interviewData);

      const response = await fetch('http://localhost:3000/interviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(interviewData),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to create interview: ${errorText}`);
      }

      const data = await response.json();
      console.log('Success response:', data);
      
      console.log('Setting createdInterview and going to step 3...');
      // Store the created interview data and go to step 3
      setCreatedInterview({
        ...data.interview,
        selectedSlots: selectedSlots,
        formData: formData
      });
      setCurrentStep(3);
      console.log('Step 3 set, currentStep should now be 3');
      
      // Refresh the interviews list
      fetchInterviews();
      // Reset form after successful creation
      resetForm();
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating interview:', error);
      alert(`Error creating interview: ${error.message}`);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setSelectedSlots([]);
    setCreatedInterview(null);
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
                <div className="w-8 h-1 bg-gray-300"></div>
                <div className={`flex items-center ${currentStep >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 3 ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300'}`}>
                    3
                  </div>
                  <span className="ml-2 font-medium">Confirmation</span>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startHour" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <select
                      id="startHour"
                      name="startHour"
                      value={formData.startHour}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value={0}>12:00 AM (Midnight)</option>
                      <option value={1}>1:00 AM</option>
                      <option value={2}>2:00 AM</option>
                      <option value={3}>3:00 AM</option>
                      <option value={4}>4:00 AM</option>
                      <option value={5}>5:00 AM</option>
                      <option value={6}>6:00 AM</option>
                      <option value={7}>7:00 AM</option>
                      <option value={8}>8:00 AM</option>
                      <option value={9}>9:00 AM</option>
                      <option value={10}>10:00 AM</option>
                      <option value={11}>11:00 AM</option>
                      <option value={12}>12:00 PM (Noon)</option>
                      <option value={13}>1:00 PM</option>
                      <option value={14}>2:00 PM</option>
                      <option value={15}>3:00 PM</option>
                      <option value={16}>4:00 PM</option>
                      <option value={17}>5:00 PM</option>
                      <option value={18}>6:00 PM</option>
                      <option value={19}>7:00 PM</option>
                      <option value={20}>8:00 PM</option>
                      <option value={21}>9:00 PM</option>
                      <option value={22}>10:00 PM</option>
                      <option value={23}>11:00 PM</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="endHour" className="block text-sm font-medium text-gray-700 mb-1">
                      End Time
                    </label>
                    <select
                      id="endHour"
                      name="endHour"
                      value={formData.endHour}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value={1}>1:00 AM</option>
                      <option value={2}>2:00 AM</option>
                      <option value={3}>3:00 AM</option>
                      <option value={4}>4:00 AM</option>
                      <option value={5}>5:00 AM</option>
                      <option value={6}>6:00 AM</option>
                      <option value={7}>7:00 AM</option>
                      <option value={8}>8:00 AM</option>
                      <option value={9}>9:00 AM</option>
                      <option value={10}>10:00 AM</option>
                      <option value={11}>11:00 AM</option>
                      <option value={12}>12:00 PM (Noon)</option>
                      <option value={13}>1:00 PM</option>
                      <option value={14}>2:00 PM</option>
                      <option value={15}>3:00 PM</option>
                      <option value={16}>4:00 PM</option>
                      <option value={17}>5:00 PM</option>
                      <option value={18}>6:00 PM</option>
                      <option value={19}>7:00 PM</option>
                      <option value={20}>8:00 PM</option>
                      <option value={21}>9:00 PM</option>
                      <option value={22}>10:00 PM</option>
                      <option value={23}>11:00 PM</option>
                      <option value={24}>12:00 AM (Next Day)</option>
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
                      placeholder="https://meet.google.com/abc-defg-hij"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter your Google Meet, Zoom, or other video conferencing link
                    </p>
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
                      placeholder="Conference Room A, 123 Main Street, Suite 100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the physical location where the interview will take place
                    </p>
                  </div>
                )}

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setShowCreateForm(false);
                    }}
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
            ) : currentStep === 2 ? (
              /* Step 2: Time Slot Selection */
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Step 2: Select Time Slots</h3>
                
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Time Slot Information</h4>
                  <p className="text-sm text-blue-700">
                    Each interview slot is {formData.duration} minutes long.
                    {formData.bufferTime === 0 ? ' No buffer time between interviews.' : ` ${formData.bufferTime} minutes buffer time between interviews.`}
                    Total time needed per slot: {calculateTotalSlotTime(formData.duration, formData.bufferTime)} minutes.
                    Click on time slots to select them for your interview availability.
                  </p>
                  <div className="mt-3 p-3 bg-blue-100 rounded border border-blue-300">
                    <p className="text-xs text-blue-800">
                      <strong>Grid Explanation:</strong> Each row represents a {formData.duration}-minute interview slot. 
                      {formData.bufferTime > 0 ? ` The ${formData.bufferTime}-minute buffer time is included in the spacing between slots.` : ' Since there is no buffer time, slots are back-to-back.'}
                    </p>
                  </div>
                </div>

                {/* Week Calendar Grid */}
                <div className="overflow-x-auto">
                  <div className="min-w-max">
                    {/* Header Row - Fixed */}
                    <div className="grid grid-cols-8 gap-1 mb-2">
                      <div className="w-20 h-10"></div> {/* Empty corner */}
                      {generateWeekCalendar().map((date, index) => (
                        <div key={index} className="w-32 h-10 bg-gray-100 rounded flex items-center justify-center text-sm font-medium text-gray-700">
                          {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                      ))}
                    </div>

                    {/* Time Slots - Scrollable Container */}
                    <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                      <div className="min-w-max">
                        {getTimeSlots().map((slot, timeIndex) => (
                          <div key={timeIndex} className="grid grid-cols-8 gap-1 mb-1">
                            <div className="w-20 h-8 flex items-center justify-center text-xs text-gray-600 font-medium">
                              {slot.time}
                            </div>
                            {generateWeekCalendar().map((date, dateIndex) => {
                              const isSelected = isSlotSelected(date, slot.time);
                              return (
                                <button
                                  key={dateIndex}
                                  onMouseDown={() => handleMouseDown(date, slot.time)}
                                  onMouseEnter={() => handleMouseEnter(date, slot.time)}
                                  onMouseUp={handleMouseUp}
                                  className={`w-32 h-8 rounded border-2 transition-all ${
                                    isSelected
                                      ? 'bg-green-500 border-green-600'
                                      : 'bg-white border-gray-200 hover:bg-green-50 hover:border-green-300'
                                  }`}
                                  title={`${slot.time} - ${formData.duration} minute interview${formData.bufferTime > 0 ? ` + ${formData.bufferTime} min buffer` : ''}`}
                                >
                                </button>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Available time slots: <span className="font-medium text-blue-600">{getTimeSlots().length}</span> | 
                    Selected slots: <span className="font-medium text-green-600">{selectedSlots.length}</span>
                  </p>
                  {getTimeSlots().length > 20 && (
                    <p className="text-xs text-gray-500 mb-2">
                      💡 Use the scroll bar to view all available time slots
                    </p>
                  )}
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
            ) : currentStep === 3 ? (
              /* Step 3: Confirmation */
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Step 3: Interview Confirmation</h3>
                
                {createdInterview && (
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
                          <h4 className="text-lg font-medium text-green-800">Interview Created Successfully!</h4>
                          <p className="text-sm text-green-700">Your interview slots are now available for candidates to book.</p>
                        </div>
                      </div>
                    </div>

                    {/* Interview Details */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Interview Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Title</p>
                          <p className="font-medium text-gray-900">{createdInterview.title}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Type</p>
                          <p className="font-medium text-gray-900 capitalize">{createdInterview.formData.interviewType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Duration</p>
                          <p className="font-medium text-gray-900">{createdInterview.formData.duration} minutes</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Buffer Time</p>
                          <p className="font-medium text-gray-900">{createdInterview.formData.bufferTime} minutes</p>
                        </div>
                        {createdInterview.formData.interviewType === 'online' && (
                          <div className="md:col-span-2">
                            <p className="text-sm text-gray-600">Interview Link</p>
                            <p className="font-medium text-gray-900 break-all">{createdInterview.formData.interviewLink}</p>
                          </div>
                        )}
                        {createdInterview.formData.interviewType === 'in-person' && (
                          <div className="md:col-span-2">
                            <p className="text-sm text-gray-600">Location</p>
                            <p className="font-medium text-gray-900">{createdInterview.formData.location}</p>
                          </div>
                        )}
                        {createdInterview.description && (
                          <div className="md:col-span-2">
                            <p className="text-sm text-gray-600">Description</p>
                            <p className="font-medium text-gray-900">{createdInterview.description}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Selected Time Slots */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Selected Time Slots</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {createdInterview.selectedSlots.map((slot, index) => (
                          <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="text-sm font-medium text-blue-900">
                              {new Date(slot.date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </div>
                            <div className="text-lg font-semibold text-blue-800">{slot.time}</div>
                            <div className="text-xs text-blue-600">
                              {createdInterview.formData.duration} min interview
                              {createdInterview.formData.bufferTime > 0 && ` + ${createdInterview.formData.bufferTime} min buffer`}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 text-sm text-gray-600">
                        Total slots: <span className="font-medium text-blue-600">{createdInterview.selectedSlots.length}</span>
                      </div>
                    </div>

                    {/* Share Interview Link */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Share Interview Availability</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Share this link with candidates so they can book interview slots:
                      </p>
                      
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2">
                          <code className="text-sm text-gray-800 break-all">
                            {`${window.location.origin}/book-interview/${createdInterview.id || createdInterview.token || 'loading...'}`}
                          </code>
                        </div>
                        <button
                          onClick={() => {
                            const bookingUrl = `${window.location.origin}/book-interview/${createdInterview.id || createdInterview.token || ''}`;
                            if (bookingUrl.includes('loading...')) {
                              alert('Please wait for the interview to be fully created.');
                              return;
                            }
                            navigator.clipboard.writeText(bookingUrl);
                            alert('Interview booking link copied to clipboard!');
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
                        <h5 className="text-sm font-medium text-blue-800 mb-2">Preview the Interview Booking Page</h5>
                        <p className="text-sm text-blue-700 mb-3">
                          This is the client-side code that candidates will see when they visit your interview link.
                        </p>
                        
                        {/* Localhost Preview Info */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                          <p className="text-xs text-yellow-800">
                            <strong>Local Development:</strong> To preview this interview booking page in localhost, 
                            use: <code className="bg-yellow-100 px-1 rounded">http://localhost:5173/book-interview/{createdInterview.id || createdInterview.token || 'ID'}</code>
                          </p>
                        </div>
                        
                        <a
                          href={`/book-interview/${createdInterview.id || createdInterview.token || '#'}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                            (createdInterview.id || createdInterview.token) 
                              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                          }`}
                          onClick={(e) => {
                            if (!(createdInterview.id || createdInterview.token)) {
                              e.preventDefault();
                              alert('Please wait for the interview to be fully created.');
                            }
                          }}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Open Interview Booking Page
                        </a>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 pt-4">
                      <button
                        type="button"
                        onClick={handleFinishInterview}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Create Another Interview
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Step 2: Time Slot Selection */
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Step 2: Select Time Slots</h3>
                
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Time Slot Information</h4>
                  <p className="text-sm text-blue-700">
                    Each interview slot is {formData.duration} minutes long.
                    {formData.bufferTime === 0 ? ' No buffer time between interviews.' : ` ${formData.bufferTime} minutes buffer time between interviews.`}
                    Total time needed per slot: {calculateTotalSlotTime(formData.duration, formData.bufferTime)} minutes.
                    Click on time slots to select them for your interview availability.
                  </p>
                  <div className="mt-3 p-3 bg-blue-100 rounded border border-blue-300">
                    <p className="text-xs text-blue-800">
                      <strong>Grid Explanation:</strong> Each row represents a {formData.duration}-minute interview slot. 
                      {formData.bufferTime > 0 ? ` The ${formData.bufferTime}-minute buffer time is included in the spacing between slots.` : ' Since there is no buffer time, slots are back-to-back.'}
                    </p>
                  </div>
                </div>

                {/* Week Calendar Grid */}
                <div className="overflow-x-auto">
                  <div className="min-w-max">
                    {/* Header Row - Fixed */}
                    <div className="grid grid-cols-8 gap-1 mb-2">
                      <div className="w-20 h-10"></div> {/* Empty corner */}
                      {generateWeekCalendar().map((date, index) => (
                        <div key={index} className="w-32 h-10 bg-gray-100 rounded flex items-center justify-center text-sm font-medium text-gray-700">
                          {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                      ))}
                    </div>

                    {/* Time Slots - Scrollable Container */}
                    <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                      <div className="min-w-max">
                        {getTimeSlots().map((slot, timeIndex) => (
                          <div key={timeIndex} className="grid grid-cols-8 gap-1 mb-1">
                            <div className="w-20 h-8 flex items-center justify-center text-xs text-gray-600 font-medium">
                              {slot.time}
                            </div>
                            {generateWeekCalendar().map((date, dateIndex) => {
                              const isSelected = isSlotSelected(date, slot.time);
                              return (
                                <button
                                  key={dateIndex}
                                  onMouseDown={() => handleMouseDown(date, slot.time)}
                                  onMouseEnter={() => handleMouseEnter(date, slot.time)}
                                  onMouseUp={handleMouseUp}
                                  className={`w-32 h-8 rounded border-2 transition-all ${
                                    isSelected
                                      ? 'bg-green-500 border-green-600'
                                      : 'bg-white border-gray-200 hover:bg-green-50 hover:border-green-300'
                                  }`}
                                  title={`${slot.time} - ${formData.duration} minute interview${formData.bufferTime > 0 ? ` + ${formData.bufferTime} min buffer` : ''}`}
                                >
                                </button>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Available time slots: <span className="font-medium text-blue-600">{getTimeSlots().length}</span> | 
                    Selected slots: <span className="font-medium text-green-600">{selectedSlots.length}</span>
                  </p>
                  {getTimeSlots().length > 20 && (
                    <p className="text-xs text-gray-500 mb-2">
                      💡 Use the scroll bar to view all available time slots
                    </p>
                  )}
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
          
          <EventList
            events={interviews}
            loading={loading}
            eventType="interview"
            primaryButtonText="Manage"
            secondaryButtonText="Share"
            onCloseClick={handleCloseInterview}
            onDeleteClick={handleDeleteInterview}
          />
        </div>
      </div>
    </div>
  );
};

export default InterviewsPage;
