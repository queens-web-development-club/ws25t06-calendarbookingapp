import LoadingSpinner from './LoadingSpinner';
import EventCard from './EventCard';

const EventList = ({ 
  events, 
  loading, 
  eventType = 'event', // 'interview' or 'meeting'
  emptyStateIcon,
  emptyStateTitle,
  emptyStateDescription,
  primaryButtonText = 'Manage',
  primaryButtonLink,
  secondaryButtonText = 'Share',
  onSecondaryButtonClick,
  getEventDetails,
  getEventLink
}) => {
  const getDefaultEmptyState = () => {
    if (eventType === 'interview') {
      return {
        icon: (
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
        title: `No ${eventType} slots yet`,
        description: `Create your first ${eventType} slots to get started!`
      };
    } else {
      return {
        icon: (
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
        ),
        title: `No ${eventType}s yet`,
        description: `Create your first ${eventType} to get started!`
      };
    }
  };

  const defaultEmptyState = getDefaultEmptyState();
  const icon = emptyStateIcon || defaultEmptyState.icon;
  const title = emptyStateTitle || defaultEmptyState.title;
  const description = emptyStateDescription || defaultEmptyState.description;



  if (loading) {
    return <LoadingSpinner variant="compact" message={`Loading ${eventType}s...`} />;
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className={`w-16 h-16 ${eventType === 'interview' ? 'bg-green-100' : 'bg-blue-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
          {icon}
        </div>
        <h4 className="text-lg font-medium text-gray-900 mb-2">{title}</h4>
        <p className="text-gray-600 mb-4">{description}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          eventType={eventType}
          primaryButtonText={primaryButtonText}
          primaryButtonLink={primaryButtonLink}
          secondaryButtonText={secondaryButtonText}
          onSecondaryButtonClick={onSecondaryButtonClick}
          getEventDetails={getEventDetails}
          getEventLink={getEventLink}
        />
      ))}
    </div>
  );
};

export default EventList;
