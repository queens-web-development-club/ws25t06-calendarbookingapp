import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';

const Home = () => {
  const { user, login, logout, loading } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Add custom CSS for cycling animations
  const cyclingStyles = `
    @keyframes cycleDemo1 {
      0%, 33.33% { opacity: 1; z-index: 10; }
      33.34%, 100% { opacity: 0; z-index: 1; }
    }
    @keyframes cycleDemo2 {
      0%, 33.33% { opacity: 0; z-index: 1; }
      33.34%, 66.66% { opacity: 1; z-index: 10; }
      66.67%, 100% { opacity: 0; z-index: 1; }
    }
    @keyframes cycleDemo3 {
      0%, 66.66% { opacity: 0; z-index: 1; }
      66.67%, 100% { opacity: 1; z-index: 10; }
    }
  `;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(password);
      setPassword('');
    } catch (error) {
      setError('Invalid QWEB password. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Custom CSS for cycling animations */}
      <style>{cyclingStyles}</style>
      
      {/* Hero Section */}
      <div className="relative overflow-hidden w-full">
        {/* Background decorative elements for hero section */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient orbs positioned only behind the demo area (right side) */}
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-300/40 to-purple-300/40 rounded-full blur-2xl"></div>
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-br from-indigo-300/50 to-blue-300/50 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tr from-purple-300/45 to-indigo-300/45 rounded-full blur-2xl"></div>
          
          {/* Geometric accent behind demo cards */}
          <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-gradient-to-br from-blue-400/60 to-purple-400/60 rounded-lg rotate-12 blur-sm"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Text Content */}
            <div className="text-center lg:text-left">
              {/* QWEB Brand */}
              <div className="mb-8">
                <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                  QWEB's{' '}
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Booking Platform
                  </span>
                </h1>
              </div>
              
              <p className="text-2xl md:text-3xl text-gray-700 mb-4 max-w-4xl font-light">
                The Ultimate
              </p>
              <p className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 max-w-4xl">
                Interview & Team Meeting Scheduler
              </p>
              
              <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl leading-relaxed">
                Streamline QWEB's interview scheduling and team coordination with our unified platform. 
                No more switching between tools - everything QWEB needs in one place.
              </p>
              
              {!user ? (
                <div className="max-w-md mx-auto lg:mx-0">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Access QWEB's Platform</h3>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                          QWEB Team Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter QWEB team password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                      {error && (
                        <p className="text-red-600 text-sm text-center">{error}</p>
                      )}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Signing In...' : 'Access Platform'}
                      </button>
                    </form>
                    <p className="text-sm text-gray-500 mt-4 text-center">
                      Use your QWEB team password to access the booking platform
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    to="/interviews"
                    className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl text-base font-semibold transition-all shadow-lg transform hover:scale-105 flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Interviews
                  </Link>
                  <Link
                    to="/meetings"
                    className="group bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl text-base font-semibold transition-all shadow-lg transform hover:scale-105 flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    Team Meetings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl text-base font-semibold transition-all shadow-lg transform hover:scale-105"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Right Side - Cycling Product Demos */}
            <div className="relative h-80 lg:h-[400px]">
              {/* Demo 1: Interview Scheduling - Larger Card */}
              <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-all duration-500" style={{ 
                animation: 'cycleDemo1 6s infinite',
                width: '90%',
                height: '80%',
                top: '10%',
                left: '5%'
              }}>
                <div className="text-center mb-4">
                  <h4 className="text-lg font-bold text-gray-800 mb-2">Interview Scheduling</h4>
                  <p className="text-sm text-gray-600">Professional booking interface</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-semibold text-gray-800 text-sm">Frontend Developer Interview</h5>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Available</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z" />
                      </svg>
                      <span>Mon, Jan 15, 2024</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>2:00 PM - 3:00 PM</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>Interview Room 1</span>
                    </div>
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors mt-3 text-sm">
                    Book This Slot
                  </button>
                </div>
              </div>

              {/* Demo 2: Team Meeting Coordination - Medium Card */}
              <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-all duration-500" style={{ 
                animation: 'cycleDemo2 6s infinite',
                width: '90%',
                height: '80%',
                top: '10%',
                left: '5%'
              }}>
                <div className="text-center mb-4">
                  <h4 className="text-lg font-bold text-gray-800 mb-2">Team Meeting Coordination</h4>
                  <p className="text-sm text-gray-600">Find when most people are free</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-800 text-sm mb-3">Q4 Planning Meeting</h5>
                  
                  {/* Team Availability Grid */}
                  <div className="grid grid-cols-5 gap-1 mb-3">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, dayIndex) => (
                      <div key={day} className="text-center">
                        <div className="text-xs font-medium text-gray-600 mb-1">{day}</div>
                        {['9AM', '2PM', '4PM'].map((time, timeIndex) => {
                          const slotIndex = dayIndex * 3 + timeIndex;
                          const availability = [8, 7, 6, 9, 8, 7, 8, 6, 7, 8, 7, 6, 8, 7, 8]; // Mock availability counts
                          const isBest = availability[slotIndex] === 9; // 9 people available
                          
                          return (
                            <div key={time} className={`text-center py-1 rounded text-xs font-medium mb-1 ${
                              isBest ? 'bg-green-500 text-white' : 
                              availability[slotIndex] >= 7 ? 'bg-green-100 text-green-800' :
                              availability[slotIndex] >= 5 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {availability[slotIndex]}/10
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-xs text-gray-600 mb-3">
                    <div className="flex items-center justify-between">
                      <span>Best time: Thu 2PM (9/10 available)</span>
                    </div>
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors text-sm">
                    Schedule Meeting
                  </button>
                </div>
              </div>

              {/* Demo 3: Unified Calendar - Larger Card */}
              <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-all duration-500" style={{ 
                animation: 'cycleDemo3 6s infinite',
                width: '95%',
                height: '85%',
                top: '7.5%',
                left: '2.5%'
              }}>
                <div className="text-center mb-4">
                  <h4 className="text-lg font-bold text-gray-800 mb-2">Unified Calendar</h4>
                  <p className="text-sm text-gray-600">All interviews & meetings in one view</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-sm font-bold text-gray-800">January 2024</h5>
                    <div className="flex space-x-1">
                      <button className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">Month</button>
                      <button className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs font-medium">Week</button>
                    </div>
                  </div>
                  
                  {/* Mini Calendar Grid */}
                  <div className="grid grid-cols-7 gap-0.5">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                      <div key={day} className="text-center text-xs font-medium text-gray-600 py-1">
                        {day}
                      </div>
                    ))}
                    
                    {/* Sample Calendar Days */}
                    {Array.from({ length: 21 }, (_, i) => {
                      const day = i + 1;
                      const hasEvent = [1, 3, 8, 15].includes(day);
                      const isInterview = [3, 15].includes(day);
                      
                      return (
                        <div key={i} className={`text-center text-xs py-1 ${
                          hasEvent ? 'bg-blue-50' : 'bg-white'
                        }`}>
                          <div className="text-gray-900">{day}</div>
                          {hasEvent && (
                            <div className={`text-xs p-0.5 rounded text-white truncate ${
                              isInterview ? 'bg-green-500' : 'bg-blue-500'
                            }`}>
                              {isInterview ? 'I' : 'M'}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Legend */}
                  <div className="flex items-center justify-center space-x-3 mt-3 text-xs">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
                      <span>Interviews</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded mr-1"></div>
                      <span>Meetings</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Built Specifically for{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                QWEB
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our platform is tailored to QWEB's needs as a student organization, providing the exact tools they need for efficient team coordination.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Feature 1: Interview Scheduling */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg mb-6 transform hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Interview Scheduling</h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Streamlined interview booking system designed for QWEB's recruitment process. Easy scheduling, room assignment, and confirmation management.
              </p>
              <div className="space-y-2 text-left">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Professional booking interface
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Automated confirmations
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Room and time management
                </div>
              </div>
            </div>

            {/* Feature 2: Team Availability Coordination */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-lg mb-6 transform hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Team Availability Coordination</h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Find the perfect time when most QWEB team members are available. Like Lettuce Meet, but built specifically for QWEB's team coordination needs.
              </p>
              <div className="space-y-2 text-left">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Visual availability grid
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Best time recommendations
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Team member availability tracking
                </div>
              </div>
            </div>

            {/* Feature 3: Unified Calendar */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl shadow-lg mb-6 transform hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Unified Calendar View</h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                See all QWEB events in one place - interviews, team meetings, and other activities. No more switching between different calendars.
              </p>
              <div className="space-y-2 text-left">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  All events in one calendar
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Color-coded by event type
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Month and week views
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                100%
              </div>
              <div className="text-blue-100 text-lg">QWEB Team Coverage</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                24/7
              </div>
              <div className="text-blue-100 text-lg">Platform Availability</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                ∞
              </div>
              <div className="text-blue-100 text-lg">Meeting Possibilities</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Streamline QWEB's Operations?
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-12 leading-relaxed">
            Join QWEB's team in using this unified platform for all your interview scheduling and team coordination needs.
          </p>
          
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/interviews"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl text-lg font-semibold transition-all shadow-lg transform hover:scale-105 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Try Interview Scheduling
              </Link>
              <Link
                to="/meetings"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold transition-all shadow-lg transform hover:scale-105 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                Try Team Coordination
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/bookings"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl text-lg font-semibold transition-all shadow-lg transform hover:scale-105 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z" />
                </svg>
                View QWEB's Calendar
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="py-12 bg-gray-900 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-6 md:mb-0">
              <div>
                <h3 className="text-xl font-bold text-white">QWEB's Booking Platform</h3>
                <p className="text-gray-400 text-sm">Built for QWEB, by QWEB</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                Streamlining QWEB's interview scheduling and team coordination
              </p>
              <p className="text-gray-500 text-xs mt-1">
                © 2024 QWEB Student Organization
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
