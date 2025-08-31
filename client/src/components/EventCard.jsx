import { Link } from 'react-router-dom';

const EventCard = ({ 
  event, 
  eventType = 'event', // 'interview' or 'meeting'
  primaryButtonText = 'Manage',
  primaryButtonLink,
  secondaryButtonText = 'Share',
  onSecondaryButtonClick,
  onCloseClick,
  onDeleteClick,
  getEventDetails,
  getEventLink
}) => {
  const getDefaultEventDetails = (event) => {
    const details = [];
    
    // Duration
    if (event.duration) {
      details.push(`Duration: ${event.duration} minutes`);
    } else if (event.settings?.duration) {
      details.push(`Duration: ${event.settings.duration} minutes`);
    }
    
    // Created date
    if (event.created) {
      details.push(`Created: ${new Date(event.created).toLocaleDateString()}`);
    } else if (event.createdAt) {
      details.push(`Created: ${new Date(event.createdAt).toLocaleDateString()}`);
    }
    
    // Type
    if (event.meetingType) {
      details.push(`Type: ${event.meetingType === 'online' ? 'Online' : 'In-Person'}`);
    } else if (event.interviewType) {
      details.push(`Type: ${event.interviewType}`);
    } else if (event.settings?.interviewType) {
      details.push(`Type: ${event.settings.interviewType === 'online' ? 'Online' : 'In-Person'}`);
    }
    
    // Link or Location
    if (event.meetingType === 'online' && event.meetingLink) {
      details.push(
        <span key="link">
          Link: <a href={event.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{event.meetingLink}</a>
        </span>
      );
    } else if (event.interviewType === 'Online' && event.settings?.interviewLink) {
      details.push(
        <span key="link">
          Link: <a href={event.settings.interviewLink} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">{event.settings.interviewLink}</a>
        </span>
      );
    } else if (event.settings?.interviewType === 'online' && event.settings?.interviewLink) {
      details.push(
        <span key="link">
          Link: <a href={event.settings.interviewLink} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">{event.settings.interviewLink}</a>
        </span>
      );
    } else if (event.meetingType === 'in-person' && event.location) {
      details.push(`Location: ${event.location}`);
    } else if (event.interviewType === 'In-Person' && event.settings?.location) {
      details.push(`Location: ${event.settings.location}`);
    } else if (event.settings?.interviewType === 'in-person' && event.settings?.location) {
      details.push(`Location: ${event.settings.location}`);
    }
    
    return details;
  };

  const getDefaultEventLink = (event) => {
    if (eventType === 'interview') {
      return `/interviews/${event.id}`;
    } else {
      return `/team-booking/${event.id}`;
    }
  };

  const getDefaultSecondaryButtonClick = (event) => {
    // Use token if available, otherwise fall back to id
    const identifier = event.token || event.id;
    const bookingUrl = `${window.location.origin}/book-${eventType}/${identifier}`;
    navigator.clipboard.writeText(bookingUrl);
    alert(`${eventType.charAt(0).toUpperCase() + eventType.slice(1)} booking link copied to clipboard!`);
  };

  const eventDetails = getEventDetails ? getEventDetails(event) : getDefaultEventDetails(event);
  const eventLink = getEventLink ? getEventLink(event) : getDefaultEventLink(event);
  const handleSecondaryClick = onSecondaryButtonClick ? () => onSecondaryButtonClick(event) : () => getDefaultSecondaryButtonClick(event);

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-lg font-semibold text-gray-900">{event.title}</h4>
            {event.status === 'closed' && (
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                Closed
              </span>
            )}
          </div>
          {event.description && (
            <p className="text-gray-600 mb-3">{event.description}</p>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            {eventDetails.map((detail, index) => (
              <span key={index}>{detail}</span>
            ))}
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleSecondaryClick}
            className={`${eventType === 'interview' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} text-white px-4 py-2 rounded-md text-sm font-medium transition-colors`}
            title={`Copy ${eventType} booking link to clipboard`}
          >
            {secondaryButtonText}
          </button>
          {onCloseClick && (
            <button
              onClick={() => onCloseClick(event)}
              disabled={event.status === 'closed'}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                event.status === 'closed'
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-yellow-600 hover:bg-yellow-700 text-white'
              }`}
              title={event.status === 'closed' ? `${eventType} is already closed` : `Close ${eventType}`}
            >
              Close
            </button>
          )}
          {onDeleteClick && (
            <button
              onClick={() => onDeleteClick(event)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              title={`Delete ${eventType}`}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
