const express = require('express');
const router = express.Router();
const pool = require('../db');
const { generateTimeSlots } = require('../utils/timeSlotGenerator');
const { cleanupOldTimeSlots, getDatabaseStats, optimizeDatabase } = require('../utils/cleanup');



// POST /timeslots/batch - Create multiple time slots from frontend selection (MOST EFFICIENT)
router.post('/batch', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const {
      event_id,
      selectedSlots // Array of { date, time, duration, bufferTime }
    } = req.body;

    // Validate required fields
    if (!event_id || !selectedSlots || !Array.isArray(selectedSlots)) {
      return res.status(400).json({
        error: 'Missing required fields: event_id and selectedSlots array are required'
      });
    }

    // Validate slot count to prevent excessive database load
    const maxSlots = 500;
    if (selectedSlots.length > maxSlots) {
      return res.status(400).json({
        error: `Too many time slots requested. Maximum allowed: ${maxSlots}, requested: ${selectedSlots.length}`,
        suggestion: 'Consider selecting fewer time slots'
      });
    }

    console.log(`Creating ${selectedSlots.length} selected time slots for event ${event_id}`);
    console.log('Selected slots data:', JSON.stringify(selectedSlots, null, 2));

    // Start transaction for better performance and consistency
    await client.query('BEGIN');

    // Convert frontend slot format to database format
    const timeSlots = selectedSlots.map(slot => {
      // Convert "h:mm a" format to 24-hour format
      const timeMatch = slot.time.match(/(\d+):(\d+)\s*(am|pm)/i);
      if (!timeMatch) {
        throw new Error(`Invalid time format: ${slot.time}`);
      }
      
      let hour = parseInt(timeMatch[1]);
      const minute = parseInt(timeMatch[2]);
      const period = timeMatch[3].toLowerCase();
      
      // Convert to 24-hour format
      if (period === 'pm' && hour !== 12) {
        hour += 12;
      } else if (period === 'am' && hour === 12) {
        hour = 0;
      }
      
      // Create date with the converted time
      const startTime = new Date(slot.date);
      startTime.setHours(hour, minute, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + (slot.duration || 30));
      
      return {
        event_id: event_id,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        is_available: true
      };
    });

    // Build a single bulk insert
    const placeholders = timeSlots
      .map((_, idx) => {
        const offset = idx * 4;
        return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`;
      })
      .join(', ');

    const values = timeSlots.flatMap(slot => [
      slot.event_id,
      slot.start_time,
      slot.end_time,
      slot.is_available
    ]);

    const query = `
      INSERT INTO time_slots (event_id, start_time, end_time, is_available)
      VALUES ${placeholders}
      RETURNING id, event_id, start_time, end_time, is_available
    `;

    const result = await client.query(query, values);
    const createdSlots = result.rows;

    await client.query('COMMIT');

    console.log(`Successfully created ${createdSlots.length} time slots`);

    res.status(201).json({
      message: `Created ${createdSlots.length} time slots successfully`,
      timeSlots: createdSlots,
      performance: {
        totalSlots: createdSlots.length,
        queryType: 'single_bulk_insert'
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating time slots:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  } finally {
    client.release();
  }
});

// GET /timeslots/event/:eventId - Get all time slots for an event
router.get('/event/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;

    const query = `
      SELECT id, event_id, start_time, end_time, is_available, created_at
      FROM time_slots 
      WHERE event_id = $1
      ORDER BY start_time
    `;

    const result = await pool.query(query, [eventId]);
    
    res.json({
      timeSlots: result.rows,
      count: result.rows.length
    });

  } catch (error) {
    console.error('Error fetching time slots:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});



module.exports = router;