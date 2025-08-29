import { useLocation, useNavigate } from 'react-router-dom';

const BookingVerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingDetails } = location.state || {};

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Access</h2>
          <p className="text-gray-600 mb-4">No booking details found.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent mb-4">
            Interview Booked Successfully!
          </h1>
          <p className="text-xl text-gray-600">
            Your interview has been confirmed. Check your email for additional details.
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Booking Confirmation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Your Information
              </h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="text-base font-semibold text-gray-800">
                    {bookingDetails.firstName} {bookingDetails.lastName}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-base font-semibold text-gray-800">{bookingDetails.email}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="text-base font-semibold text-gray-800">{bookingDetails.phone}</p>
                </div>
              </div>
            </div>

            {/* Interview Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Interview Details
              </h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Position</p>
                  <p className="text-base font-semibold text-gray-800">{bookingDetails.position}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="text-base font-semibold text-gray-800">
                    {formatDate(bookingDetails.date)} at {bookingDetails.time}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="text-base font-semibold text-gray-800">{bookingDetails.duration} minutes</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="text-base font-semibold text-gray-800 capitalize">
                    {bookingDetails.type} interview
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            What Happens Next?
          </h3>
          
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start">
              <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
              <p>You'll receive a confirmation email with interview details</p>
            </div>
            <div className="flex items-start">
              <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
              <p>For online interviews, the meeting link will be sent 24 hours before</p>
            </div>
            <div className="flex items-start">
              <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
              <p>Please arrive 5 minutes early for your interview</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            🏠 Back to Home
          </button>
          
          <button
            onClick={() => window.print()}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            🖨️ Print Confirmation
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingVerificationPage;
