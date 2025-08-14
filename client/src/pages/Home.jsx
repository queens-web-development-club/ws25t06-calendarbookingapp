import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-qweb-50 to-qweb-green-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-qweb-blue-600 to-qweb-green-600 bg-clip-text text-transparent">
                Queen's Web Development
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamline your team meetings and interview scheduling with our unified booking platform. 
              No more switching between multiple tools - everything you need in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user ? (
                <>
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-qweb-blue-600 to-qweb-green-600 hover:from-qweb-blue-700 hover:to-qweb-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all shadow-lg transform hover:scale-105"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="bg-white hover:bg-gray-50 text-qweb-blue-600 border-2 border-qweb-blue-600 px-8 py-3 rounded-lg text-lg font-semibold transition-colors shadow-lg"
                  >
                    Sign In
                  </Link>
                </>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/meetings"
                    className="bg-gradient-to-r from-qweb-blue-600 to-qweb-blue-700 hover:from-qweb-blue-700 hover:to-qweb-blue-800 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all shadow-lg transform hover:scale-105"
                  >
                    Schedule Team Meeting
                  </Link>
                  <Link
                    to="/interviews"
                    className="bg-gradient-to-r from-qweb-green-600 to-qweb-green-700 hover:from-qweb-green-700 hover:to-qweb-green-800 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all shadow-lg transform hover:scale-105"
                  >
                    Book Interview
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We've combined the best features from Calendly and LettuceMeet to create 
              the perfect solution for QWeb's needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-qweb-blue-100 to-qweb-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-qweb-blue-200 group-hover:to-qweb-blue-300 transition-colors">
                <svg className="w-8 h-8 text-qweb-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Meetings</h3>
              <p className="text-gray-600">
                Schedule team meetings with availability polling, just like LettuceMeet. 
                Find the perfect time that works for everyone.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-qweb-green-100 to-qweb-green-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-qweb-green-200 group-hover:to-qweb-green-300 transition-colors">
                <svg className="w-8 h-8 text-qweb-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Interview Scheduling</h3>
              <p className="text-gray-600">
                Professional interview booking system similar to Calendly. 
                Easy scheduling with automated confirmations and reminders.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-purple-200 group-hover:to-purple-300 transition-colors">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Unified Management</h3>
              <p className="text-gray-600">
                View and manage all your bookings in one place. 
                No more switching between platforms or losing track of schedules.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-qweb-600 to-qweb-green-600 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join QWeb members who are already using our platform to streamline their scheduling.
          </p>
          {!user ? (
            <Link
              to="/signup"
              className="bg-white hover:bg-gray-50 text-qweb-blue-600 px-8 py-3 rounded-lg text-lg font-semibold transition-all shadow-lg inline-block transform hover:scale-105"
            >
              Create Your Account
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/meetings"
                className="bg-white hover:bg-gray-50 text-qweb-blue-600 px-8 py-3 rounded-lg text-lg font-semibold transition-all shadow-lg transform hover:scale-105"
              >
                Schedule Meeting
              </Link>
              <Link
                to="/interviews"
                className="bg-white hover:bg-gray-50 text-qweb-green-600 px-8 py-3 rounded-lg text-lg font-semibold transition-all shadow-lg transform hover:scale-105"
              >
                Book Interview
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
