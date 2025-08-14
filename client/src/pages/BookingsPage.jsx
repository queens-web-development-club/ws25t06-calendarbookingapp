import { useState, useEffect } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

const BookingsPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, meetings, interviews, upcoming, past

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      // Fetch both meetings and interviews
      const [meetingsSnapshot, interviewsSnapshot] = await Promise.all([
        getDocs(query(
          collection(db, 'meetings'),
          where('creatorId', '==', user.uid),
          orderBy('createdAt', 'desc')
        )),
        getDocs(query(
          collection(db, 'interviews'),
          where('creatorId', '==', user.uid),
          orderBy('createdAt', 'desc')
        ))
      ]);

      const meetings = meetingsSnapshot.docs.map(doc => ({
        id: doc.id,
        type: 'meeting',
        ...doc.data()
      }));

      const interviews = interviewsSnapshot.docs.map(doc => ({
        id: doc.id,
        type: 'interview',
        ...doc.data()
      }));

      // Combine and sort by creation date
      const allBookings = [...meetings, ...interviews].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );

      setBookings(allBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredBookings = () => {
    const now = new Date();
    
    switch (filter) {
      case 'meetings':
        return bookings.filter(booking => booking.type === 'meeting');
      case 'interviews':
        return bookings.filter(booking => booking.type === 'interview');
      case 'upcoming':
        return bookings.filter(booking => {
          if (booking.deadline) {
            return new Date(booking.deadline) > now;
          }
          return true; // If no deadline, consider it ongoing
        });
      case 'past':
        return bookings.filter(booking => {
          if (booking.deadline) {
            return new Date(booking.deadline) <= now;
          }
          return false;
        });
      default:
        return bookings;
    }
  };

  const getStatusBadge = (booking) => {
    if (booking.type === 'meeting') {
      if (booking.deadline && new Date(booking.deadline) < new Date()) {
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Closed</span>;
      }
      return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Active</span>;
    } else {
      if (booking.bookings && booking.bookings.length >= (booking.maxBookings || 0)) {
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Full</span>;
      }
      return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Open</span>;
    }
  };

  const getTypeIcon = (type) => {
    if (type === 'meeting') {
      return (
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      );
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view your bookings</h2>
        </div>
      </div>
    );
  }

  const filteredBookings = getFilteredBookings();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            My Bookings
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            View and manage all your team meetings and interview bookings in one place.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { key: 'all', label: 'All Bookings', count: bookings.length },
              { key: 'meetings', label: 'Team Meetings', count: bookings.filter(b => b.type === 'meeting').length },
              { key: 'interviews', label: 'Interviews', count: bookings.filter(b => b.type === 'interview').length },
              { key: 'upcoming', label: 'Upcoming', count: bookings.filter(b => {
                if (b.deadline) return new Date(b.deadline) > new Date();
                return true;
              }).length },
              { key: 'past', label: 'Past', count: bookings.filter(b => {
                if (b.deadline) return new Date(b.deadline) <= new Date();
                return false;
              }).length }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your bookings...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h4>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? "You haven't created any bookings yet. Start by creating a team meeting or interview slots!"
                  : `No ${filter} bookings found. Try adjusting your filters.`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div key={`${booking.type}-${booking.id}`} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    {getTypeIcon(booking.type)}
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{booking.title}</h4>
                        {getStatusBadge(booking)}
                      </div>
                      
                      {booking.description && (
                        <p className="text-gray-600 mb-3">{booking.description}</p>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                        <div>
                          <span className="font-medium">Type:</span> {booking.type === 'meeting' ? 'Team Meeting' : 'Interview'}
                        </div>
                        <div>
                          <span className="font-medium">Duration:</span> {booking.duration} minutes
                        </div>
                        <div>
                          <span className="font-medium">Created:</span> {new Date(booking.createdAt).toLocaleDateString()}
                        </div>
                        
                        {booking.type === 'meeting' && (
                          <>
                            <div>
                              <span className="font-medium">Max Participants:</span> {booking.maxParticipants}
                            </div>
                            {booking.deadline && (
                              <div>
                                <span className="font-medium">Deadline:</span> {new Date(booking.deadline).toLocaleDateString()}
                              </div>
                            )}
                            <div>
                              <span className="font-medium">Responses:</span> {booking.responses?.length || 0}
                            </div>
                          </>
                        )}
                        
                        {booking.type === 'interview' && (
                          <>
                            <div>
                              <span className="font-medium">Location:</span> {booking.location || 'Not specified'}
                            </div>
                            <div>
                              <span className="font-medium">Bookings:</span> {booking.bookings?.length || 0} / {booking.maxBookings}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <a
                        href={`/${booking.type}s/${booking.id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors text-center"
                      >
                        Manage
                      </a>
                      <span className="text-xs text-gray-500 text-center">
                        {booking.type === 'meeting' ? 'View responses' : 'View bookings'}
                      </span>
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

export default BookingsPage;
