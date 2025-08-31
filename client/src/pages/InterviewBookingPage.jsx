import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const InterviewBookingPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInterview();
  }, [token]);

  // Auto-select first available date when interview data loads
  useEffect(() => {
    if (interview && interview.availableSlots && interview.availableSlots.length > 0) {
      const firstAvailableDate = interview.availableSlots.find(slot => slot.available)?.date;
      if (firstAvailableDate) {
        setSelectedDate(firstAvailableDate);
      }
    }
  }, [interview]);

  const fetchInterview = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`http://localhost:3000/interviews/${token}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Interview not found. Please check the booking link.');
        }
        throw new Error('Failed to load interview details');
      }
      
      const data = await response.json();
      
      // Transform the API response to match the expected format
      const transformedInterview = {
        id: data.interview.id,
        title: data.interview.title,
        description: data.interview.description,
        duration: data.interview.settings?.duration || 30,
        bufferTime: data.interview.settings?.bufferTime || 15,
        interviewType: data.interview.settings?.interviewType || 'online',
        location: data.interview.settings?.location || null,
        organizerName: data.interview.organizerName,
        organizerEmail: data.interview.organizerEmail,
        status: data.interview.status, // Include the status field
        // Transform availableSlots to match the expected format
        availableSlots: data.availableSlots.map((slot, index) => ({
          key: slot.id,
          id: slot.id,
          date: new Date(slot.startTime).toISOString().split('T')[0],
          time: new Date(slot.startTime).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }),
          available: slot.isAvailable,
          bookingCount: slot.bookingCount || 0,
          startTime: slot.startTime,
          endTime: slot.endTime
        }))
      };
      
      setInterview(transformedInterview);
    } catch (error) {
      console.error('Error fetching interview:', error);
      setError(error.message || 'Failed to load interview details');
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setShowBookingForm(false);
  };

  const handleSlotSelect = (slot) => {
    console.log('Slot selected:', slot);
    setSelectedSlot(slot);
    setShowBookingForm(true);
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
    
    console.log('Form submitted with data:', formData);
    console.log('Selected slot:', selectedSlot);
    console.log('Interview data:', interview);
    
    if (!selectedSlot) {
      setError('Please select a time slot');
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setError('All fields are required');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Prepare the response data
      const responseData = {
        eventId: interview.id,
        timeSlotIds: [selectedSlot.id], // For interviews, only one slot can be selected
        userName: `${formData.firstName} ${formData.lastName}`,
        userEmail: formData.email
      };

      console.log('Sending response data to API:', responseData);

      // Call the responses API
      const response = await fetch('http://localhost:3000/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to book interview');
      }

      const result = await response.json();
      console.log('Booking successful:', result);

      // Redirect to verification page with booking details
      try {
        navigate('/booking-verification', { 
          state: { 
            bookingDetails: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phone: formData.phone,
              position: interview.title,
              date: selectedSlot.date,
              time: selectedSlot.time,
              duration: interview.duration,
              type: interview.interviewType,
              responseId: result.response.id
            }
          }
        });
      } catch (navigationError) {
        console.error('Navigation error:', navigationError);
        setError('Failed to redirect. Please try again.');
      }
      
    } catch (error) {
      console.error('Error booking interview:', error);
      setError('Failed to book interview. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Generate calendar data for current month
  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push({ day: '', isEmpty: true });
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasSlots = interview?.availableSlots?.some(slot => 
        slot.date === dateString && slot.available
      );
      const isSelected = selectedDate === dateString;
      
      days.push({
        day,
        date: dateString,
        hasSlots,
        isSelected,
        isEmpty: false
      });
    }
    
    return days;
  };

  const getAvailableSlotsForDate = (date) => {
    if (!interview?.availableSlots) return [];
    return interview.availableSlots.filter(slot => 
      slot.date === date && slot.available
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error && !interview) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Interview Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Please check the link or contact the interviewer.</p>
        </div>
      </div>
    );
  }

  // Check if interview is closed
  if (interview && interview.status === 'closed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Interview Closed</h2>
          <p className="text-gray-600 mb-4">This interview has been closed and is no longer accepting bookings.</p>
          <p className="text-sm text-gray-500">Please contact the interviewer if you have any questions.</p>
        </div>
      </div>
    );
  }

  if (!interview) {
    return null;
  }

  const calendarDays = generateCalendarDays();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonth = new Date().getMonth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column - Interview Details */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 h-fit hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Interview Details</h2>
              </div>
              <div className="space-y-5">
                <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm flex items-center">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                    Position
                  </h3>
                  <p className="text-gray-700 text-sm font-bold">
                    {interview.title}
                  </p>
                </div>
                
                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Description
                  </h3>
                  <p className="text-gray-700 text-xs leading-relaxed">
                    {interview.description}
                  </p>
                </div>
                
                <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Duration
                  </h3>
                  <p className="text-gray-700 text-sm font-medium">
                    {interview.duration} minute interview
                  </p>
                </div>
                
                <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    Type
                  </h3>
                  <p className="text-gray-700 capitalize text-sm font-medium">
                    {interview.interviewType} interview
                    {interview.interviewType === 'online' && interview.interviewLink && (
                      <span className="block text-xs text-blue-600 mt-2 font-medium">
                        🔗 Link will be provided after booking
                      </span>
                    )}
                    {interview.interviewType === 'in-person' && interview.location && (
                      <span className="block text-xs text-gray-600 mt-2 font-medium">
                        📍 Location: {interview.location}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Calendar */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
              <div className="text-center mb-4">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent mb-1">
                  {monthNames[currentMonth]} {new Date().getFullYear()}
                </h2>
                <p className="text-gray-600 font-medium text-sm">Click on a date to see available time slots</p>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-bold text-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {calendarDays.map((day, index) => (
                  <div key={index} className="p-1">
                    {day.isEmpty ? (
                      <div className="h-12"></div>
                    ) : (
                      <button
                        onClick={() => handleDateSelect(day.date)}
                        disabled={!day.hasSlots}
                        className={`w-full h-12 rounded-lg text-sm font-semibold transition-all duration-200 transform hover:scale-105 ${
                          day.isSelected
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                            : day.hasSlots
                            ? 'bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-200 hover:border-blue-300 hover:shadow-md'
                            : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <div className="relative flex items-center justify-center h-full">
                          <span className="text-base">{day.day}</span>
                          {day.hasSlots && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-sm"></div>
                          )}
                        </div>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-4 flex items-center justify-center space-x-6 text-xs">
                <div className="flex items-center space-x-2 bg-white/60 px-3 py-1 rounded-full border border-gray-200">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full shadow-sm"></div>
                  <span className="text-gray-700 font-medium">Available dates</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/60 px-3 py-1 rounded-full border border-gray-200">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-sm"></div>
                  <span className="text-gray-700 font-medium">Selected date</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/60 px-3 py-1 rounded-full border border-gray-200">
                  <div className="w-2 h-2 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full shadow-sm"></div>
                  <span className="text-gray-700 font-medium">No slots</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Available Slots & Booking Form */}
          <div className="lg:col-span-1 space-y-4">
            {/* Available Slots for Selected Date */}
            {selectedDate && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-5 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Available Slots for {new Date(selectedDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h2>
                </div>
                
                {getAvailableSlotsForDate(selectedDate).length === 0 ? (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l4 4m0 0l4-4m-4 4V8" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm">No available slots for this date.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {getAvailableSlotsForDate(selectedDate).map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => handleSlotSelect(slot)}
                        className={`w-full p-3 text-left rounded-xl border-2 transition-all duration-200 transform hover:scale-102 ${
                          selectedSlot?.key === slot.key
                            ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 shadow-md'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-sm'
                        }`}
                      >
                        <div className="font-semibold text-sm flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          {slot.time}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Debug Info */}
            {showBookingForm && (
              <div className="text-xs text-gray-500 mb-2">
                Debug: showBookingForm={showBookingForm.toString()}, selectedSlot={selectedSlot ? 'yes' : 'no'}, formData={formData ? 'yes' : 'no'}
              </div>
            )}
            
            {/* Booking Form */}
            {showBookingForm && selectedSlot && formData && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-5 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Your Information</h2>
                </div>
                
                <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                  <p className="text-xs text-green-800 font-medium">
                    <strong>Selected:</strong> {new Date(selectedSlot.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })} at {selectedSlot.time}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm transition-all duration-200 hover:border-gray-400"
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm transition-all duration-200 hover:border-gray-400"
                      placeholder="Enter your last name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm transition-all duration-200 hover:border-gray-400"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm transition-all duration-200 hover:border-gray-400"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl">
                      <p className="text-xs text-red-800 font-medium">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-4 rounded-xl font-bold transition-all duration-200 disabled:cursor-not-allowed text-sm shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                  >
                    {submitting ? 'Booking Interview...' : 'Book Interview'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewBookingPage;

