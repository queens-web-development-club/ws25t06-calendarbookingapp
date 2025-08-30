import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TeamBookingPage = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  
  // Mock meeting data
  const [meeting, setMeeting] = useState({
    id: meetingId,
    title: 'Weekly Team Standup',
    description: 'Daily standup meeting for the development team',
    duration: 30,
    meetingType: 'online',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    location: null,
    availableSlots: [
      { date: '2024-01-15', time: '9:00 AM', duration: 30 },
      { date: '2024-01-15', time: '10:00 AM', duration: 30 },
      { date: '2024-01-15', time: '11:00 AM', duration: 30 },
      { date: '2024-01-15', time: '2:00 PM', duration: 30 },
      { date: '2024-01-15', time: '3:00 PM', duration: 30 },
      { date: '2024-01-15', time: '4:00 PM', duration: 30 },
      { date: '2024-01-16', time: '9:00 AM', duration: 30 },
      { date: '2024-01-16', time: '10:00 AM', duration: 30 },
      { date: '2024-01-16', time: '11:00 AM', duration: 30 },
      { date: '2024-01-16', time: '2:00 PM', duration: 30 },
      { date: '2024-01-16', time: '3:00 PM', duration: 30 },
      { date: '2024-01-16', time: '4:00 PM', duration: 30 },
    ]
  });

  // Mock responders data
  const [responders, setResponders] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      availability: {
        '2024-01-15_9:00 AM': true,
        '2024-01-15_10:00 AM': true,
        '2024-01-15_11:00 AM': false,
        '2024-01-15_2:00 PM': true,
        '2024-01-15_3:00 PM': true,
        '2024-01-15_4:00 PM': false,
        '2024-01-16_9:00 AM': true,
        '2024-01-16_10:00 AM': false,
        '2024-01-16_11:00 AM': true,
        '2024-01-16_2:00 PM': true,
        '2024-01-16_3:00 PM': true,
        '2024-01-16_4:00 PM': true,
      }
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      availability: {
        '2024-01-15_9:00 AM': false,
        '2024-01-15_10:00 AM': true,
        '2024-01-15_11:00 AM': true,
        '2024-01-15_2:00 PM': true,
        '2024-01-15_3:00 PM': false,
        '2024-01-15_4:00 PM': true,
        '2024-01-16_9:00 AM': true,
        '2024-01-16_10:00 AM': true,
        '2024-01-16_11:00 AM': true,
        '2024-01-16_2:00 PM': false,
        '2024-01-16_3:00 PM': true,
        '2024-01-16_4:00 PM': true,
      }
    },
    {
      id: 3,
      name: 'Mike Davis',
      email: 'mike@example.com',
      availability: {
        '2024-01-15_9:00 AM': true,
        '2024-01-15_10:00 AM': true,
        '2024-01-15_11:00 AM': true,
        '2024-01-15_2:00 PM': false,
        '2024-01-15_3:00 PM': true,
        '2024-01-15_4:00 PM': true,
        '2024-01-16_9:00 AM': false,
        '2024-01-16_10:00 AM': true,
        '2024-01-16_11:00 AM': true,
        '2024-01-16_2:00 PM': true,
        '2024-01-16_3:00 PM': true,
        '2024-01-16_4:00 PM': false,
      }
    },
    {
      id: 4,
      name: 'Emily Wilson',
      email: 'emily@example.com',
      availability: {
        '2024-01-15_9:00 AM': false,
        '2024-01-15_10:00 AM': false,
        '2024-01-15_11:00 AM': true,
        '2024-01-15_2:00 PM': true,
        '2024-01-15_3:00 PM': true,
        '2024-01-15_4:00 PM': true,
        '2024-01-16_9:00 AM': true,
        '2024-01-16_10:00 AM': true,
        '2024-01-16_11:00 AM': false,
        '2024-01-16_2:00 PM': true,
        '2024-01-16_3:00 PM': false,
        '2024-01-16_4:00 PM': true,
      }
    }
  ]);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    console.log('Form submitted:', formData);
    console.log('Selected time slots:', selectedTimeSlots);
    setShowAvailabilityForm(false);
    setFormData({ name: '', email: '' });
    setSelectedTimeSlots([]);
    setIsEditMode(false);
  };

  // Close modal
  const closeModal = () => {
    setShowAvailabilityForm(false);
    setFormData({ name: '', email: '' });
    setSelectedTimeSlots([]);
    setIsEditMode(false);
  };

  // Edit mode functions
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
    if (isDragging && dragStart !== slotKey) {
      handleTimeSlotClick(slotKey);
    }
  };

  const getSelectedTimeSlotsCount = () => {
    return selectedTimeSlots.length;
  };

  const startEditMode = () => {
    setIsEditMode(true);
    setSelectedTimeSlots([]);
  };

  // Calculate availability count for each time slot
  const getAvailabilityCount = (date, time) => {
    const slotKey = `${date}_${time}`;
    return responders.filter(responder => responder.availability[slotKey]).length;
  };

  // Get availability percentage for heatmap
  const getAvailabilityPercentage = (date, time) => {
    const count = getAvailabilityCount(date, time);
    const percentage = (count / responders.length) * 100;
    return percentage;
  };

  // Get heatmap color based on availability
  const getHeatmapColor = (percentage) => {
    if (percentage === 0) return 'bg-gray-100';
    if (percentage <= 25) return 'bg-blue-100';
    if (percentage <= 50) return 'bg-blue-200';
    if (percentage <= 75) return 'bg-blue-300';
    return 'bg-blue-500 text-white';
  };

  // Get responders for a specific time slot
  const getRespondersForSlot = (date, time) => {
    const slotKey = `${date}_${time}`;
    return responders.map(responder => ({
      ...responder,
      canAttend: responder.availability[slotKey]
    }));
  };

  // Group time slots by date
  const groupSlotsByDate = () => {
    const grouped = {};
    meeting.availableSlots.forEach(slot => {
      if (!grouped[slot.date]) {
        grouped[slot.date] = [];
      }
      grouped[slot.date].push(slot);
    });
    return grouped;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            {/* Animated qweb text */}
            <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
              qweb
            </div>
            
            {/* Animated dots */}
            <div className="flex justify-center space-x-1 mt-4">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            
            {/* Subtle loading bar */}
            <div className="mt-6 w-32 h-1 bg-gray-200 rounded-full overflow-hidden mx-auto">
              <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <p className="text-gray-600 text-lg font-medium animate-pulse">
            Loading team meeting...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {meeting.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {meeting.description}
          </p>
          <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-500">
            <span>Duration: {meeting.duration} minutes</span>
            <span>Type: {meeting.meetingType === 'online' ? 'Online' : 'In-Person'}</span>
            {meeting.meetingLink && (
              <a 
                href={meeting.meetingLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Meeting Link
              </a>
            )}
          </div>
          
          {/* Add Availability Button */}
          <div className="mt-6">
            <button
              onClick={startEditMode}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Availability
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Availability Heatmap */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {isEditMode ? 'Select Your Availability' : 'Team Availability'}
                </h2>
                {isEditMode && (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">
                      Selected: <span className="font-medium text-blue-600">{getSelectedTimeSlotsCount()}</span> slots
                    </span>
                    <button
                      onClick={() => setIsEditMode(false)}
                      className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setShowAvailabilityForm(true)}
                      disabled={getSelectedTimeSlotsCount() === 0}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                    </button>
                  </div>
                )}
              </div>
              
              {!isEditMode && (
                /* Heatmap Legend */
                <div className="flex items-center justify-center mb-6 space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-100 rounded"></div>
                    <span className="text-sm text-gray-600">0 people</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-100 rounded"></div>
                    <span className="text-sm text-gray-600">1-2 people</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-200 rounded"></div>
                    <span className="text-sm text-gray-600">2-3 people</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-300 rounded"></div>
                    <span className="text-sm text-gray-600">3-4 people</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-sm text-gray-600">All people</span>
                  </div>
                </div>
              )}

              {/* Availability Grid */}
              <div className="overflow-x-auto">
                <div className="min-w-max">
                  {/* Grid Header */}
                  <div className="grid bg-gray-50 border border-gray-200 rounded-t-lg" style={{ gridTemplateColumns: `150px repeat(${Object.keys(groupSlotsByDate()).length}, 1fr)` }}>
                    <div className="p-3 text-center text-sm font-medium text-gray-700 border-r border-gray-200">
                      Time
                    </div>
                    {Object.keys(groupSlotsByDate()).map((date, index) => (
                      <div key={index} className="p-3 text-center text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0">
                        {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </div>
                    ))}
                  </div>

                  {/* Time Slots Grid */}
                  <div className="border-l border-b border-r border-gray-200 rounded-b-lg">
                    {['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'].map((time, timeIndex) => (
                      <div key={timeIndex} className="grid border-b border-gray-200 last:border-b-0" style={{ gridTemplateColumns: `150px repeat(${Object.keys(groupSlotsByDate()).length}, 1fr)` }}>
                        <div className="p-3 text-center text-sm font-medium text-gray-600 border-r border-gray-200 bg-gray-50">
                          {time}
                        </div>
                        {Object.keys(groupSlotsByDate()).map((date, dateIndex) => {
                          const slotKey = `${date}_${time}`;
                          
                          if (isEditMode) {
                            // Edit mode: show selectable cells
                            const isSelected = selectedTimeSlots.includes(slotKey);
                            return (
                              <button
                                key={dateIndex}
                                onMouseDown={() => handleTimeSlotMouseDown(slotKey)}
                                onMouseEnter={() => handleTimeSlotMouseEnter(slotKey)}
                                className={`p-3 border-r border-gray-200 last:border-r-0 transition-all cursor-ns-resize hover:ring-2 hover:ring-blue-300 ${
                                  isSelected 
                                    ? 'bg-blue-500 text-white ring-2 ring-blue-600' 
                                    : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                              >
                              </button>
                            );
                          } else {
                            // View mode: show availability heatmap
                            const availabilityCount = getAvailabilityCount(date, time);
                            const percentage = getAvailabilityPercentage(date, time);
                            const colorClass = getHeatmapColor(percentage);
                            
                            return (
                              <button
                                key={dateIndex}
                                onClick={() => setSelectedSlot({ date, time, slotKey })}
                                className={`p-3 border-r border-gray-200 last:border-r-0 transition-all duration-200 cursor-pointer hover:ring-2 hover:ring-blue-300 hover:shadow-md ${
                                  selectedSlot?.slotKey === slotKey 
                                    ? 'ring-4 ring-blue-500 ring-offset-2 shadow-lg scale-105 z-10 relative' 
                                    : ''
                                } ${colorClass}`}
                                title={`${availabilityCount} of ${responders.length} people available`}
                              >
                              </button>
                            );
                          }
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {isEditMode && (
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    💡 Click and drag to select multiple time slots
                  </p>
                  <p className="text-xs text-gray-500">
                    Selected slots will be marked as available for your schedule
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Responders Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Responders</h2>
              
              {/* Selected Time Slot Details */}
              {selectedSlot ? (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-medium text-blue-900 mb-3">
                      {new Date(selectedSlot.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedSlot.time}
                    </h3>
                    
                    <div className="space-y-2">
                      {getRespondersForSlot(selectedSlot.date, selectedSlot.time).map((responder) => (
                        <div key={responder.id} className="flex items-center justify-between">
                          <span className={`text-sm ${responder.canAttend ? 'text-gray-900' : 'text-gray-500 line-through'}`}>
                            {responder.name}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            responder.canAttend 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {responder.canAttend ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>Click on a time slot to see who's available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Availability Form Modal */}
      {showAvailabilityForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={closeModal}
          ></div>
          
          {/* Modal */}
          <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 transform transition-all">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Add Your Availability</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Selected Time Slots Summary */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-900 mb-3">Selected Time Slots</h3>
              <div className="text-sm text-blue-800">
                <p className="mb-2">You've selected <span className="font-semibold">{getSelectedTimeSlotsCount()}</span> time slots:</p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {selectedTimeSlots.map((slotKey, index) => {
                    const [date, time] = slotKey.split('_');
                    return (
                      <div key={index} className="text-xs bg-blue-100 px-2 py-1 rounded">
                        {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {time}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Availability
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamBookingPage;

