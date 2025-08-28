import { format, setHours, setMinutes, addMinutes, isBefore, parseISO } from 'date-fns';

/**
 * Time slot utility functions for interview scheduling
 */

/**
 * Generate time slots based on duration and buffer time
 * @param {number} duration - Interview duration in minutes
 * @param {number} bufferTime - Buffer time between interviews in minutes
 * @param {number} startHour - Start hour (default: 9 AM)
 * @param {number} endHour - End hour (default: 5 PM)
 * @returns {Array} Array of time slot objects
 */
export const generateTimeSlots = (duration, bufferTime, startHour = 9, endHour = 17) => {
  // Ensure we're working with numbers
  const durationNum = parseInt(duration);
  const bufferTimeNum = parseInt(bufferTime);
  const startHourNum = parseInt(startHour);
  const endHourNum = parseInt(endHour);
  
  const slots = [];
  const totalSlotTime = durationNum + bufferTimeNum;

  // Debug logging
  console.log('generateTimeSlots called with:', { duration: durationNum, bufferTime: bufferTimeNum, totalSlotTime, startHour: startHourNum, endHour: endHourNum });

  // Create a base date for today (we only care about time)
  const baseDate = new Date();
  let currentTime = setMinutes(setHours(baseDate, startHourNum), 0);

  // Generate slots until we reach the end time
  while (isBefore(currentTime, setMinutes(setHours(baseDate, endHourNum), 0))) {
    const timeString = format(currentTime, 'h:mm a');
    
    slots.push({
      time: timeString,
      hour: currentTime.getHours(),
      minute: currentTime.getMinutes(),
      totalMinutes: currentTime.getHours() * 60 + currentTime.getMinutes(),
      available: true,
      bookedBy: null
    });

    // Move to next slot
    currentTime = addMinutes(currentTime, totalSlotTime);
  }

  console.log('Generated slots:', slots);
  return slots;
};

/**
 * Calculate total time needed for each interview slot
 * @param {number} duration - Interview duration in minutes
 * @param {number} bufferTime - Buffer time between interviews in minutes
 * @returns {number} Total time needed per slot in minutes
 */
export const calculateTotalSlotTime = (duration, bufferTime) => {
  return duration + bufferTime;
};

/**
 * Format time for display
 * @param {number} hour - Hour (0-23)
 * @param {number} minute - Minute (0-59)
 * @returns {string} Formatted time string (e.g., "9:00 AM")
 */
export const formatTime = (hour, minute) => {
  let displayHour = hour;
  let ampm = 'AM';
  
  if (hour === 12) {
    ampm = 'PM';
  } else if (hour > 12) {
    displayHour = hour - 12;
    ampm = 'PM';
  }
  
  return `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
};

/**
 * Get business hours for time slot generation
 * @returns {Object} Object with startHour and endHour
 */
export const getBusinessHours = () => {
  return {
    startHour: 9, // 9 AM
    endHour: 17   // 5 PM
  };
};