import { useState, useEffect } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const BookingsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, week
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      // Mock data for now - replace with actual API calls
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      
      const mockEvents = [
        // Current month events - only team meetings and interviews
        {
          id: 1,
          title: 'Weekly Team Standup',
          type: 'meeting',
          start: new Date(currentYear, currentMonth, 1, 9, 0),
          end: new Date(currentYear, currentMonth, 1, 9, 30),
          duration: 30,
          description: 'Daily standup meeting for the development team',
          location: 'Conference Room A',
          participants: 8,
          color: 'blue'
        },
        {
          id: 2,
          title: 'Frontend Developer Interview',
          type: 'interview',
          start: new Date(currentYear, currentMonth, 1, 14, 0),
          end: new Date(currentYear, currentMonth, 1, 15, 0),
          duration: 60,
          description: 'Interview with Sarah Johnson for Frontend Developer position',
          location: 'Interview Room 1',
          candidate: 'Sarah Johnson',
          color: 'green'
        },
        {
          id: 3,
          title: 'Product Review Meeting',
          type: 'meeting',
          start: new Date(currentYear, currentMonth, 2, 16, 0),
          end: new Date(currentYear, currentMonth, 2, 17, 0),
          duration: 60,
          description: 'Monthly product feature review and roadmap discussion',
          location: 'Board Room',
          participants: 15,
          color: 'blue'
        },
        {
          id: 4,
          title: 'Project Planning Session',
          type: 'meeting',
          start: new Date(currentYear, currentMonth, 3, 10, 0),
          end: new Date(currentYear, currentMonth, 3, 11, 30),
          duration: 90,
          description: 'Q1 project planning and roadmap discussion',
          location: 'Board Room',
          participants: 12,
          color: 'blue'
        },
        {
          id: 5,
          title: 'Backend Engineer Interview',
          type: 'interview',
          start: new Date(currentYear, currentMonth, 3, 15, 30),
          end: new Date(currentYear, currentMonth, 3, 16, 30),
          duration: 60,
          description: 'Technical interview with Mike Davis',
          location: 'Interview Room 2',
          candidate: 'Mike Davis',
          color: 'green'
        },
        {
          id: 6,
          title: 'Code Review Session',
          type: 'meeting',
          start: new Date(currentYear, currentMonth, 4, 17, 0),
          end: new Date(currentYear, currentMonth, 4, 18, 0),
          duration: 60,
          description: 'Weekly code review and best practices discussion',
          location: 'Conference Room B',
          participants: 6,
          color: 'blue'
        },
        {
          id: 7,
          title: 'Client Demo Meeting',
          type: 'meeting',
          start: new Date(currentYear, currentMonth, 5, 13, 0),
          end: new Date(currentYear, currentMonth, 5, 14, 0),
          duration: 60,
          description: 'Product demonstration for potential client',
          location: 'Conference Room B',
          participants: 6,
          color: 'blue'
        },
        {
          id: 8,
          title: 'UX Designer Interview',
          type: 'interview',
          start: new Date(currentYear, currentMonth, 5, 15, 0),
          end: new Date(currentYear, currentMonth, 5, 16, 0),
          duration: 60,
          description: 'Portfolio review with Emily Chen',
          location: 'Interview Room 1',
          candidate: 'Emily Chen',
          color: 'green'
        },
        {
          id: 9,
          title: 'Sprint Retrospective',
          type: 'meeting',
          start: new Date(currentYear, currentMonth, 8, 9, 0),
          end: new Date(currentYear, currentMonth, 8, 10, 30),
          duration: 90,
          description: 'End of sprint retrospective and lessons learned',
          location: 'Conference Room A',
          participants: 10,
          color: 'blue'
        },
        {
          id: 10,
          title: 'DevOps Engineer Interview',
          type: 'interview',
          start: new Date(currentYear, currentMonth, 8, 14, 0),
          end: new Date(currentYear, currentMonth, 8, 15, 30),
          duration: 90,
          description: 'Technical assessment with Alex Rodriguez',
          location: 'Interview Room 2',
          candidate: 'Alex Rodriguez',
          color: 'green'
        },
        {
          id: 11,
          title: 'Architecture Discussion',
          type: 'meeting',
          start: new Date(currentYear, currentMonth, 8, 16, 0),
          end: new Date(currentYear, currentMonth, 8, 17, 30),
          duration: 90,
          description: 'System architecture planning for new features',
          location: 'Board Room',
          participants: 8,
          color: 'blue'
        },
        {
          id: 12,
          title: 'Weekly Team Lunch',
          type: 'meeting',
          start: new Date(currentYear, currentMonth, 9, 12, 0),
          end: new Date(currentYear, currentMonth, 9, 13, 0),
          duration: 60,
          description: 'Team bonding and casual discussion',
          location: 'Break Room',
          participants: 20,
          color: 'blue'
        },
        {
          id: 13,
          title: 'QA Engineer Interview',
          type: 'interview',
          start: new Date(currentYear, currentMonth, 9, 15, 0),
          end: new Date(currentYear, currentMonth, 9, 16, 0),
          duration: 60,
          description: 'Quality assurance testing discussion with Lisa Wang',
          location: 'Interview Room 1',
          candidate: 'Lisa Wang',
          color: 'green'
        },
        {
          id: 14,
          title: 'All-Hands Meeting',
          type: 'meeting',
          start: new Date(currentYear, currentMonth, 10, 10, 0),
          end: new Date(currentYear, currentMonth, 10, 11, 0),
          duration: 60,
          description: 'Company-wide updates and announcements',
          location: 'Main Auditorium',
          participants: 50,
          color: 'blue'
        },
        {
          id: 15,
          title: 'Senior Developer Interview',
          type: 'interview',
          start: new Date(currentYear, currentMonth, 10, 14, 0),
          end: new Date(currentYear, currentMonth, 10, 15, 30),
          duration: 90,
          description: 'Senior developer technical interview with David Kim',
          location: 'Interview Room 2',
          candidate: 'David Kim',
          color: 'green'
        },
        {
          id: 16,
          title: 'Design System Workshop',
          type: 'meeting',
          start: new Date(currentYear, currentMonth, 11, 9, 0),
          end: new Date(currentYear, currentMonth, 11, 11, 0),
          duration: 120,
          description: 'Design system component library workshop',
          location: 'Conference Room A',
          participants: 12,
          color: 'blue'
        },
        {
          id: 17,
          title: 'Product Manager Interview',
          type: 'interview',
          start: new Date(currentYear, currentMonth, 11, 15, 0),
          end: new Date(currentYear, currentMonth, 11, 16, 30),
          duration: 90,
          description: 'Product strategy discussion with Rachel Green',
          location: 'Interview Room 1',
          candidate: 'Rachel Green',
          color: 'green'
        },
        {
          id: 18,
          title: 'Security Review Meeting',
          type: 'meeting',
          start: new Date(currentYear, currentMonth, 12, 13, 0),
          end: new Date(currentYear, currentMonth, 12, 14, 30),
          duration: 90,
          description: 'Monthly security audit and vulnerability assessment',
          location: 'Board Room',
          participants: 8,
          color: 'blue'
        },
        {
          id: 19,
          title: 'Data Scientist Interview',
          type: 'interview',
          start: new Date(currentYear, currentMonth, 12, 16, 0),
          end: new Date(currentYear, currentMonth, 12, 17, 30),
          duration: 90,
          description: 'Data analysis and ML discussion with Tom Wilson',
          location: 'Interview Room 2',
          candidate: 'Tom Wilson',
          color: 'green'
        },
        {
          id: 20,
          title: 'Sprint Planning',
          type: 'meeting',
          start: new Date(currentYear, currentMonth, 15, 9, 0),
          end: new Date(currentYear, currentMonth, 15, 11, 0),
          duration: 120,
          description: 'Next sprint planning and task breakdown',
          location: 'Conference Room A',
          participants: 12,
          color: 'blue'
        },
        {
          id: 21,
          title: 'Frontend Lead Interview',
          type: 'interview',
          start: new Date(currentYear, currentMonth, 15, 14, 0),
          end: new Date(currentYear, currentMonth, 15, 15, 30),
          duration: 90,
          description: 'Leadership and technical discussion with Sarah Miller',
          location: 'Interview Room 1',
          candidate: 'Sarah Miller',
          color: 'green'
        },
        {
          id: 22,
          title: 'Tech Talk Friday',
          type: 'meeting',
          start: new Date(currentYear, currentMonth, 16, 15, 0),
          end: new Date(currentYear, currentMonth, 16, 16, 0),
          duration: 60,
          description: 'Weekly technical presentation and knowledge sharing',
          location: 'Conference Room B',
          participants: 25,
          color: 'blue'
        },
        {
          id: 23,
          title: 'Budget Planning Meeting',
          type: 'meeting',
          start: new Date(currentYear, currentMonth, 17, 10, 0),
          end: new Date(currentYear, currentMonth, 17, 12, 0),
          duration: 120,
          description: 'Q1 budget planning and resource allocation',
          location: 'Board Room',
          participants: 10,
          color: 'blue'
        },
        {
          id: 24,
          title: 'Mobile Developer Interview',
          type: 'interview',
          start: new Date(currentYear, currentMonth, 17, 14, 0),
          end: new Date(currentYear, currentMonth, 17, 15, 30),
          duration: 90,
          description: 'Mobile app development discussion with Chris Lee',
          location: 'Interview Room 2',
          candidate: 'Chris Lee',
          color: 'green'
        },
        {
          id: 25,
          title: 'Customer Feedback Session',
        type: 'meeting',
          start: new Date(currentYear, currentMonth, 18, 13, 0),
          end: new Date(currentYear, currentMonth, 18, 14, 30),
          duration: 90,
          description: 'Customer feedback review and feature prioritization',
          location: 'Conference Room A',
          participants: 8,
          color: 'blue'
        },
        {
          id: 26,
          title: 'DevOps Lead Interview',
        type: 'interview',
          start: new Date(currentYear, currentMonth, 18, 16, 0),
          end: new Date(currentYear, currentMonth, 18, 17, 30),
          duration: 90,
          description: 'Infrastructure and automation discussion with Mark Johnson',
          location: 'Interview Room 1',
          candidate: 'Mark Johnson',
          color: 'green'
        },
        {
          id: 27,
          title: 'Monthly Team Building',
          type: 'meeting',
          start: new Date(currentYear, currentMonth, 19, 16, 0),
          end: new Date(currentYear, currentMonth, 19, 18, 0),
          duration: 120,
          description: 'Team building activities and social event',
          location: 'Game Room',
          participants: 30,
          color: 'blue'
        }
      ];

      console.log('Mock events created (meetings & interviews only):', mockEvents);
      setEvents(mockEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getEventColor = (color) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500'
    };
    return colors[color] || 'bg-gray-500';
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (viewMode === 'month') {
        newDate.setMonth(prev.getMonth() + direction);
      } else if (viewMode === 'week') {
        newDate.setDate(prev.getDate() + (direction * 7));
      }
      return newDate;
    });
  };

  const navigateToday = () => {
    const today = new Date();
    setCurrentDate(today);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    // Reset to current month when changing view modes
    if (mode !== 'month') {
      setCurrentDate(new Date());
    }
  };

  // Get days for the current month view
  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of month
    const firstDay = new Date(year, month, 1);
    // Get last day of month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get starting day (previous month days to fill first week)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Get ending day (next month days to fill last week)
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    const days = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  // Get days for week view
  const getWeekDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();
    
    // Get the start of the week (Sunday)
    const startOfWeek = new Date(year, month, day);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view the calendar</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner variant="compact" message="Loading calendar..." />;
  }

  // Get days based on current view mode
  let daysToRender = [];
  let viewTitle = '';
  
  switch (viewMode) {
    case 'week':
      daysToRender = getWeekDays();
      const weekStart = daysToRender[0];
      const weekEnd = daysToRender[6];
      viewTitle = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      break;
    default: // month
      daysToRender = getMonthDays();
      viewTitle = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            QWEB Calendar
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            View all team meetings, interviews, and events in one comprehensive calendar.
          </p>
        </div>

        {/* Calendar Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <h2 className="text-2xl font-bold text-gray-900">{viewTitle}</h2>
              
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={navigateToday}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Today
              </button>
              
              <div className="flex bg-gray-100 rounded-lg p-1">
                {['month', 'week'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => handleViewModeChange(mode)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      viewMode === mode
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>
                      </div>
                      
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="bg-gray-50 p-3 text-center">
                <div className="text-sm font-semibold text-gray-700">{day}</div>
              </div>
            ))}
            
            {/* Calendar Days */}
            {daysToRender.map((day, index) => {
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isToday = day.toDateString() === new Date().toDateString();
              const dayEvents = getEventsForDate(day);
              
              // Debug logging for the first few days
              if (index < 7) {
                console.log(`Day ${day.toDateString()}: ${dayEvents.length} events`, dayEvents);
              }
              
              return (
                <div
                  key={index}
                  className={`min-h-32 bg-white p-2 relative ${
                    !isCurrentMonth && viewMode === 'month' ? 'bg-gray-50' : ''
                  }`}
                >
                  {/* Date Number */}
                  <div className={`text-sm font-medium mb-1 ${
                    isToday 
                      ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center'
                      : isCurrentMonth || viewMode !== 'month'
                        ? 'text-gray-900' 
                        : 'text-gray-400'
                  }`}>
                    {day.getDate()}
                        </div>
                        
                  {/* Events */}
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className={`${getEventColor(event.color)} text-white text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity truncate`}
                        title={`${event.title} - ${formatTime(event.start)}`}
                      >
                        {event.title}
                            </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayEvents.length - 3} more
                              </div>
                            )}
                            </div>
                            </div>
              );
            })}
                      </div>
                    </div>
                    
        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div 
              className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={() => setSelectedEvent(null)}
            ></div>
            
            <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 transform transition-all">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Event Details</h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{selectedEvent.title}</h4>
                  <p className="text-gray-600">{selectedEvent.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Type:</span>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        selectedEvent.type === 'meeting' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {selectedEvent.type === 'meeting' ? 'Team Meeting' : 'Interview'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Duration:</span>
                    <div className="mt-1 text-gray-600">{selectedEvent.duration} minutes</div>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Date:</span>
                    <div className="mt-1 text-gray-600">
                      {selectedEvent.start.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Time:</span>
                    <div className="mt-1 text-gray-600">
                      {formatTime(selectedEvent.start)} - {formatTime(selectedEvent.end)}
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Location:</span>
                    <div className="mt-1 text-gray-600">{selectedEvent.location}</div>
                  </div>
                  
                  {selectedEvent.type === 'meeting' ? (
                    <div>
                      <span className="font-medium text-gray-700">Participants:</span>
                      <div className="mt-1 text-gray-600">{selectedEvent.participants}</div>
                    </div>
                  ) : (
                    <div>
                      <span className="font-medium text-gray-700">Candidate:</span>
                      <div className="mt-1 text-gray-600">{selectedEvent.candidate}</div>
                    </div>
                  )}
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default BookingsPage;
