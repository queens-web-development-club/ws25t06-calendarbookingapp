const express = require('express');
const router = express.Router();
const pool = require('../db');


// POST /api/interviews - Create a new interview event
router.post('/', async (req, res) => {
  try {
    console.log('Received interview creation request:', req.body);
    
    const {
      title,
      description,
      duration,
      location,
      maxBookings,
      organizerEmail,
      organizerName,
      interviewType,
      bufferTime,
      startHour,
      endHour,
      availableSlots
    } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        error: 'Missing required fields: title, duration, maxBookings, organizerEmail are required'
      });
    }

    // Create settings object with interview-specific data
    const settings = {
      duration: parseInt(duration) || 30,
      location: location || '',
      interviewType: interviewType || 'online',
      startHour: parseInt(startHour) || 9,
      endHour: parseInt(endHour) || 17
    };

    // Insert into events table
    const query = `
      INSERT INTO events (title, description, type, settings, organizer_email, organizer_name)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, title, description, type, settings, organizer_email, organizer_name, created_at
    `;

    const values = [
      title,
      description || '',
      'interview',
      JSON.stringify(settings),
      "",
      ""
    ];

    const result = await pool.query(query, values);
    const newInterview = result.rows[0];

    // Create time slots if availableSlots are provided
    if (availableSlots && availableSlots.length > 0) {
      try {
        console.log(`Creating ${availableSlots.length} time slots for interview ${newInterview.id}`);
        console.log('Available slots data:', availableSlots);
        
        // Convert frontend slot format to database format
        const timeSlots = availableSlots.map(slot => {
          console.log('Processing slot:', slot);
          
          // Convert "h:mm a" format to 24-hour format
          const timeMatch = slot.time.match(/(\d+):(\d+)\s*(am|pm)/i);
          if (!timeMatch) {
            throw new Error(`Invalid time format: ${slot.time}`);
          }
          
          let hour = parseInt(timeMatch[1]);
          const minute = parseInt(timeMatch[2]);
          const period = timeMatch[3].toLowerCase();
          
          console.log(`Time parsing: ${slot.time} -> hour: ${hour}, minute: ${minute}, period: ${period}`);
          
          // Convert to 24-hour format
          if (period === 'pm' && hour !== 12) {
            hour += 12;
          } else if (period === 'am' && hour === 12) {
            hour = 0;
          }
          
          console.log(`Converted to 24-hour: ${hour}:${minute}`);
          
          // Create date with the converted time
          const startTime = new Date(slot.date);
          startTime.setHours(hour, minute, 0, 0);
          
          const endTime = new Date(startTime);
          endTime.setMinutes(endTime.getMinutes() + (parseInt(duration) || 30));
          
          console.log(`Date: ${slot.date}, Start: ${startTime.toISOString()}, End: ${endTime.toISOString()}`);
          
          return {
            event_id: newInterview.id,
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

        const timeSlotValues = timeSlots.flatMap(slot => [
          slot.event_id,
          slot.start_time,
          slot.end_time,
          slot.is_available
        ]);

        const timeSlotQuery = `
          INSERT INTO time_slots (event_id, start_time, end_time, is_available)
          VALUES ${placeholders}
          RETURNING id, event_id, start_time, end_time, is_available
        `;

        console.log('Time slots to insert:', timeSlots);
        console.log('SQL query:', timeSlotQuery);
        console.log('SQL values:', timeSlotValues);
        
        const timeSlotResult = await pool.query(timeSlotQuery, timeSlotValues);
        const createdSlots = timeSlotResult.rows;

        console.log(`Successfully created ${createdSlots.length} time slots`);
      } catch (error) {
        console.error('Error creating time slots:', error);
      }
    }

    res.status(201).json({
      message: 'Interview created successfully',
      interview: {
        id: newInterview.id,
        title: newInterview.title,
        description: newInterview.description,
        organizerName: newInterview.organizer_name,
        organizerEmail: newInterview.organizer_email,
        type: newInterview.type,
        settings: newInterview.settings,
        createdAt: newInterview.created_at,
        status: 'active'
      }
    });

  } catch (error) {
    console.error('Error creating interview:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});



// GET /api/interviews - Get all interviews for an organizer
router.get('/', async (req, res) => {
  try {
    const { organizerEmail } = req.query;

    if (!organizerEmail) {
      return res.status(400).json({
        error: 'organizerEmail query parameter is required'
      });
    }

    const query = `
      SELECT id, title, description, organizer_name, organizer_email, type, settings, status, created_at, updated_at
      FROM events 
      WHERE type = 'interview' AND organizer_email = $1
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query, [organizerEmail]);
    
    res.json({
      interviews: result.rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        organizerName: row.organizer_name,
        organizerEmail: row.organizer_email,
        type: row.type,
        settings: row.settings,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }))
    });

  } catch (error) {
    console.error('Error fetching interviews:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// GET /api/interviews/:id - Get a specific interview
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT id, title, description, organizer_name, organizer_email, type, settings, status, created_at, updated_at
      FROM events 
      WHERE id = $1 AND type = 'interview'
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Interview not found'
      });
    }

    const interview = result.rows[0];
    
    res.json({
      interview: {
        id: interview.id,
        title: interview.title,
        description: interview.description,
        organizerName: interview.organizer_name,
        organizerEmail: interview.organizer_email,
        type: interview.type,
        settings: interview.settings,
        status: interview.status,
        createdAt: interview.created_at,
        updatedAt: interview.updated_at
      }
    });

  } catch (error) {
    console.error('Error fetching interview:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

module.exports = router;
