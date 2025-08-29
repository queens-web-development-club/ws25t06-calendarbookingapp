import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { generateTimeSlots, calculateTotalSlotTime } from '../utils/timeSlots';

const MeetingsPage = () => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 30,
    startTime: '09:00',
    endTime: '17:00',
    meetingType: 'online', // 'online' or 'in-person'
    meetingLink: '',
    availableSlots: []
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (user) {
      fetchMeetings();
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
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Form submission is now handled in handleCreateMeeting after step 2
  };

  // Generate time slots based on start and end time
  const getTimeSlots = () => {
    const slots = [];
    const startHour = parseInt(formData.startTime.split(':')[0]);
    const endHour = parseInt(formData.endTime.split(':')[0]);
    
    for (let hour = startHour; hour < endHour; hour++) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      slots.push({ time: timeString });
    }
    
    return slots;
  };

  const generateMonthCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Get first day of month
    const firstDay = new Date(year, month, 1);
    // Get last day of month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay();
    
    const calendar = [];
    
    // Add previous month's days to fill first week
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(prevMonth);
      date.setDate(prevMonth.getDate() - i);
      calendar.push({ date, isCurrentMonth: false });
    }
    
    // Add current month's days
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      calendar.push({ date, isCurrentMonth: true });
    }
    
    // Add next month's days to fill last week
    const remainingDays = 42 - calendar.length; // 6 rows * 7 days = 42
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      calendar.push({ date, isCurrentMonth: false });
    }
    
    return calendar;
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const handleDayClick = (date) => {
    const dayKey = date.toISOString().split('T')[0];
    setSelectedSlots(prev => {
      if (prev.find(slot => slot.key === dayKey)) {
        return prev.filter(slot => slot.key !== dayKey);
      } else {
        return [...prev, { key: dayKey, date: dayKey, selected: true }];
      }
    });
  };

  const isDaySelected = (date) => {
    const dayKey = date.toISOString().split('T')[0];
    return selectedSlots.find(slot => slot.key === dayKey);
  };

  // Step 3: Time slot availability functions
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);

  const generateTimeSlotsForGrid = () => {
    const slots = [];
    const startHour = parseInt(formData.startTime.split(':')[0]);
    const endHour = parseInt(formData.endTime.split(':')[0]);
    
    for (let hour = startHour; hour < endHour; hour++) {
      let displayHour = hour;
      let ampm = 'AM';
      
      if (hour === 0) {
        displayHour = 12;
        ampm = 'AM';
      } else if (hour === 12) {
        displayHour = 12;
        ampm = 'PM';
      } else if (hour > 12) {
        displayHour = hour - 12;
        ampm = 'PM';
      }
      
      const timeString = `${displayHour}:00 ${ampm}`;
      slots.push(timeString);
    }
    
    return slots;
  };

  const handleTimeSlotClick = (slotKey) => {
    setSelectedTimeSlots(prev => {
      if (prev.find(slot => slot === slotKey)) {
        return prev.filter(slot => slot !== slotKey);
      } else {
        return [...prev, slotKey];
      }
    });
  };

  const handleTimeSlotMouseDown = (slotKey) => {
    setIsDragging(true);
    setDragStart(slotKey);
    handleTimeSlotClick(slotKey);
  };

  const handleTimeSlotMouseEnter = (slotKey) => {
    if (isDragging && dragStart) {
      // Get the time and day from the slot keys
      const [startDate, startTime] = dragStart.split('_');
      const [currentDate, currentTime] = slotKey.split('_');
      
      // Only allow dragging within the same day
      if (startDate === currentDate) {
        const timeSlots = generateTimeSlotsForGrid();
        const startIndex = timeSlots.findIndex(slot => slot === startTime);
        const currentIndex = timeSlots.findIndex(slot => slot === currentTime);
        
        if (startIndex !== -1 && currentIndex !== -1) {
          const minIndex = Math.min(startIndex, currentIndex);
          const maxIndex = Math.max(startIndex, currentIndex);
          
          // Clear existing selections for this day
          setSelectedTimeSlots(prev => prev.filter(slot => !slot.startsWith(startDate + '_')));
          
          // Add all slots in the range for this day
          for (let i = minIndex; i <= maxIndex; i++) {
            const timeSlot = timeSlots[i];
            const newSlotKey = `${startDate}_${timeSlot}`;
            setSelectedTimeSlots(prev => [...prev, newSlotKey]);
          }
        }
      }
    }
  };

  const handleTimeSlotMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  const isTimeSlotSelected = (slotKey) => {
    return selectedTimeSlots.find(slot => slot === slotKey);
  };

  const getSelectedTimeSlotsCount = () => {
    return selectedTimeSlots.length;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && formData.title && formData.description) {
      setCurrentStep(2);
    } else if (currentStep === 2 && selectedSlots.length > 0) {
      setCurrentStep(3);
    }
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  const handleBackToStep2 = () => {
    setCurrentStep(2);
  };

  const handleCreateMeeting = async () => {
    if (selectedSlots.length === 0) {
      alert('Please select at least one time slot');
      return;
    }

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create new meeting
      const newMeeting = {
        id: `meeting_${Date.now()}`,
        title: formData.title,
        description: formData.description,
        duration: formData.duration,
        meetingType: formData.meetingType,
        location: formData.meetingLink,
        maxParticipants: 10,
        created: new Date().toISOString(),
        bookings: [],
        availableSlots: selectedTimeSlots.map(slotKey => {
          const [date, time] = slotKey.split('_');
          return {
            date,
            time,
            duration: formData.duration
          };
        })
      };

      setMeetings(prev => [newMeeting, ...prev]);
      setFormData({
        title: '',
        description: '',
        duration: 30,
        startTime: '09:00',
        endTime: '17:00',
        meetingType: 'online',
        meetingLink: '',
        availableSlots: []
      });
      setSelectedSlots([]);
      setSelectedTimeSlots([]);
      setCurrentStep(1);
      
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
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 max-w-4xl mx-auto">
            {/* Step Indicator */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-4">
                <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                    1
                  </div>
                  <span className="ml-2 font-medium">Meeting Details</span>
                </div>
                <div className="w-8 h-1 bg-gray-300"></div>
                <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 2 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                    2
                  </div>
                                           <span className="ml-2 font-medium">Select Days</span>
                       </div>
                       <div className="w-8 h-1 bg-gray-300"></div>
                       <div className={`flex items-center ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 3 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                           3
                         </div>
                         <span className="ml-2 font-medium">Set Availability</span>
                </div>
              </div>
            </div>

            {currentStep === 1 ? (
              /* Step 1: Meeting Details */
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Step 1: Meeting Details</h3>
                
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
                    placeholder="e.g., Weekly Team Standup"
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
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={90}>1.5 hours</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>



                {/* Meeting Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Type
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="meetingType"
                        value="online"
                        checked={formData.meetingType === 'online'}
                        onChange={handleChange}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Online</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="meetingType"
                        value="in-person"
                        checked={formData.meetingType === 'in-person'}
                        onChange={handleChange}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">In-Person</span>
                    </label>
                  </div>
                </div>

                {/* Meeting Link Field */}
                <div>
                  <label htmlFor="meetingLink" className="block text-sm font-medium text-gray-700 mb-1">
                    Meeting Link
                  </label>
                  <input
                    type="url"
                    id="meetingLink"
                    name="meetingLink"
                    value={formData.meetingLink}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., https://zoom.us/j/123456789, https://meet.google.com/abc-defg-hij"
                  />
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
                    type="button"
                    onClick={handleNextStep}
                    disabled={!formData.title || !formData.description}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </form>
            ) : currentStep === 2 ? (
              /* Step 2: Day Selection */
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Step 2: Select Days</h3>
                
                {/* Month Calendar Grid */}
                <div className="max-w-4xl mx-auto">
                  {/* Month Navigation */}
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={() => navigateMonth('prev')}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <h4 className="text-xl font-semibold text-gray-900">
                      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h4>
                    
                    <button
                      onClick={() => navigateMonth('next')}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    {/* Day Headers */}
                    <div className="grid grid-cols-7 bg-gray-50">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="p-3 text-center text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7">
                      {generateMonthCalendar().map((dayData, index) => {
                        const isSelected = isDaySelected(dayData.date);
                        const isToday = dayData.date.toDateString() === new Date().toDateString();
                        
                        return (
                          <button
                            key={index}
                            onClick={() => dayData.isCurrentMonth && handleDayClick(dayData.date)}
                            disabled={!dayData.isCurrentMonth}
                            className={`p-3 h-16 border-r border-b border-gray-200 last:border-r-0 transition-all ${
                              !dayData.isCurrentMonth
                                ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                : isSelected
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : isToday
                                ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-300'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <div className="text-sm font-medium">
                              {dayData.date.getDate()}
                            </div>
                            {isSelected && (
                              <div className="text-xs mt-1 opacity-75">
                                Selected
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Selected days: <span className="font-medium text-blue-600">{selectedSlots.length}</span>
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    💡 Click on calendar days to select when you want to have team meetings. Use the arrows to navigate between months.
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
                    onClick={handleNextStep}
                    disabled={selectedSlots.length === 0}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              /* Step 3: Set Availability */
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Step 3: Set Availability</h3>
                
                {/* Availability Grid */}
                <div className="max-w-6xl mx-auto">
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                       {/* Grid Header */}
                   <div className="grid bg-gray-50 border-b border-gray-200" style={{ gridTemplateColumns: `200px repeat(${selectedSlots.length}, 1fr)` }}>
                     <div className="p-3 text-center text-sm font-medium text-gray-700 border-r border-gray-200">
                       Time
                     </div>
                     {selectedSlots.map((slot, index) => (
                       <div key={index} className="p-3 text-center text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0">
                         {new Date(slot.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                       </div>
                     ))}
                   </div>

                   {/* Time Slots Grid */}
                   <div className="max-h-96 overflow-y-auto">
                     {generateTimeSlotsForGrid().map((timeSlot, timeIndex) => (
                       <div key={timeIndex} className="grid border-b border-gray-200 last:border-b-0" style={{ gridTemplateColumns: `200px repeat(${selectedSlots.length}, 1fr)` }}>
                         <div className="p-3 text-center text-sm font-medium text-gray-600 border-r border-gray-200 bg-gray-50">
                           {timeSlot}
                         </div>
                         {selectedSlots.map((daySlot, dayIndex) => {
                           const slotKey = `${daySlot.date}_${timeSlot}`;
                           const isSelected = isTimeSlotSelected(slotKey);
                           return (
                             <button
                               key={dayIndex}
                               onMouseDown={() => handleTimeSlotMouseDown(slotKey)}
                               onMouseEnter={() => handleTimeSlotMouseEnter(slotKey)}
                               onMouseUp={handleTimeSlotMouseUp}
                               className={`p-3 border-r border-gray-200 last:border-r-0 transition-all cursor-ns-resize ${
                                 isSelected
                                   ? 'bg-blue-500 text-white hover:bg-blue-600'
                                   : 'bg-white text-gray-700 hover:bg-blue-50'
                               }`}
                             >
                             </button>
                           );
                         })}
                       </div>
                     ))}
                   </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Available time slots: <span className="font-medium text-blue-600">{getSelectedTimeSlotsCount()}</span>
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    💡 Click on time slots to set your availability for each selected day
                  </p>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={handleBackToStep2}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateMeeting}
                    disabled={getSelectedTimeSlotsCount() === 0}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Meeting
                  </button>
                </div>
              </div>
            )}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
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
                        <span>Created: {new Date(meeting.created).toLocaleDateString()}</span>
                        <span>Type: {meeting.meetingType === 'online' ? 'Online' : 'In-Person'}</span>
                        {meeting.meetingType === 'online' && meeting.meetingLink && (
                          <span>Link: <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{meeting.meetingLink}</a></span>
                        )}
                        {meeting.meetingType === 'in-person' && meeting.location && (
                          <span>Location: {meeting.location}</span>
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
                      <button
                        onClick={() => {
                          const bookingUrl = `${window.location.origin}/book-meeting/${meeting.id}`;
                          navigator.clipboard.writeText(bookingUrl);
                          alert('Booking link copied to clipboard!');
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        title="Copy booking link to clipboard"
                      >
                        Share
                      </button>
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
