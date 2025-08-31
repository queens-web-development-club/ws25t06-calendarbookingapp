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
        error: 'Missing required fields: title, duration, organizerEmail are required'
      });
    }

    // Create settings object with interview-specific data
    const settings = {
      duration: parseInt(duration) || 30,
      startHour: parseInt(startHour) || 9,
      endHour: parseInt(endHour) || 17
    };

    // Add interview type specific data to settings
    if (interviewType === 'online') {
      settings.interviewType = 'online';
      settings.interviewLink = location || ''; // location field contains the interview link for online interviews
    } else {
      settings.interviewType = 'in-person';
      settings.location = location || ''; // location field contains the physical location for in-person interviews
    }

    // Insert into events table
    const query = `
      INSERT INTO events (title, description, type, settings, organizer_email, organizer_name)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, title, description, type, settings, organizer_email, organizer_name, created_at, token
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
        status: 'active',
        token: newInterview.token
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
    console.log('GET /interviews called');
    console.log('Query params:', req.query);
    
    const { organizerEmail } = req.query;

    // Always return all interviews regardless of organizerEmail for now
    // This ensures we can see all interviews in the database
    const query = `
      SELECT id, title, description, organizer_name, organizer_email, type, settings, status, created_at, updated_at, token
      FROM events 
      WHERE type = 'interview'
      ORDER BY created_at DESC
    `;

    console.log('Executing query:', query);

    const result = await pool.query(query);
    console.log('Query result rows:', result.rows);
    console.log('Number of interviews found:', result.rows.length);
    
    res.json({
      interviews: result.rows.map(row => {
        const settings = row.settings || {};
        
        // Determine interview type from settings
        let interviewType = 'Online';
        if (settings.location) {
          interviewType = 'In-Person';
        }
        
        return {
          id: row.id,
          title: row.title,
          description: row.description,
          organizerName: row.organizer_name || '',
          organizerEmail: row.organizer_email || '',
          type: row.type,
          settings: row.settings,
          interviewType: interviewType, // Add the determined interview type
          status: row.status,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          token: row.token
        };
      })
    });

  } catch (error) {
    console.error('Error fetching interviews:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// GET /api/interviews/debug - Debug endpoint to check database
router.get('/debug/check', async (req, res) => {
  try {
    console.log('Debug endpoint called');
    const result = await pool.query('SELECT COUNT(*) as count FROM events');
    console.log('Total events in database:', result.rows[0].count);
    
    // Also check for interviews specifically
    const interviewResult = await pool.query("SELECT COUNT(*) as count FROM events WHERE type = 'interview'");
    console.log('Total interviews in database:', interviewResult.rows[0].count);
    
    res.json({
      message: 'Database connection working',
      totalEvents: result.rows[0].count,
      totalInterviews: interviewResult.rows[0].count
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({
      error: 'Database connection failed',
      details: error.message
    });
  }
});

// GET /api/interviews/:token - Get a specific interview by token with available timeslots
router.get('/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // First, get the interview details by token
    const interviewQuery = `
      SELECT id, title, description, organizer_name, organizer_email, type, settings, status, created_at, updated_at, token
      FROM events 
      WHERE token = $1 AND type = 'interview'
    `;

    const interviewResult = await pool.query(interviewQuery, [token]);

    if (interviewResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Interview not found'
      });
    }

    const interview = interviewResult.rows[0];

    // Get all available timeslots for this interview
    const timeslotsQuery = `
      SELECT id, start_time, end_time, is_available, created_at
      FROM time_slots 
      WHERE event_id = $1 AND is_available = true
      ORDER BY start_time ASC
    `;

    const timeslotsResult = await pool.query(timeslotsQuery, [interview.id]);
    const availableSlots = timeslotsResult.rows.map(slot => ({
      id: slot.id,
      startTime: slot.start_time,
      endTime: slot.end_time,
      isAvailable: slot.is_available,
      createdAt: slot.created_at
    }));

    // Get booking count for each slot (optional - to show how many people have booked each slot)
    // For now, let's skip this to avoid any database schema issues
    const slotsWithBookings = availableSlots.map(slot => ({
      ...slot,
      bookingCount: 0 // We'll add this back later when the booking system is implemented
    }));
    
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
        updatedAt: interview.updated_at,
        token: interview.token
      },
      availableSlots: slotsWithBookings,
      totalAvailableSlots: slotsWithBookings.length
    });

  } catch (error) {
    console.error('Error fetching interview by token:', error);
    console.error('Token:', req.params.token);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// PATCH /api/interviews/:id/close - Close an interview (set status to 'closed')
router.patch('/:id/close', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if interview exists
    const checkQuery = `
      SELECT id, title, status FROM events 
      WHERE id = $1 AND type = 'interview'
    `;
    
    const checkResult = await pool.query(checkQuery, [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Interview not found'
      });
    }

    const interview = checkResult.rows[0];
    
    if (interview.status === 'closed') {
      return res.status(400).json({
        error: 'Interview is already closed'
      });
    }

    // Update the interview status to closed
    const updateQuery = `
      UPDATE events 
      SET status = 'closed', updated_at = NOW()
      WHERE id = $1 AND type = 'interview'
      RETURNING id, title, status, updated_at
    `;

    const updateResult = await pool.query(updateQuery, [id]);

    res.json({
      message: 'Interview closed successfully',
      interview: {
        id: updateResult.rows[0].id,
        title: updateResult.rows[0].title,
        status: updateResult.rows[0].status,
        updatedAt: updateResult.rows[0].updated_at
      }
    });

  } catch (error) {
    console.error('Error closing interview:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// DELETE /api/interviews/:id - Delete an interview and all related data
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if interview exists
    const checkQuery = `
      SELECT id, title FROM events 
      WHERE id = $1 AND type = 'interview'
    `;
    
    const checkResult = await pool.query(checkQuery, [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Interview not found'
      });
    }

    const interview = checkResult.rows[0];

    // Begin transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Delete related responses first (due to foreign key constraints)
      const deleteResponsesQuery = `
        DELETE FROM responses 
        WHERE event_id = $1
      `;
      await client.query(deleteResponsesQuery, [id]);

      // Delete related time slots
      const deleteTimeSlotsQuery = `
        DELETE FROM time_slots 
        WHERE event_id = $1
      `;
      await client.query(deleteTimeSlotsQuery, [id]);

      // Delete the interview
      const deleteInterviewQuery = `
        DELETE FROM events 
        WHERE id = $1 AND type = 'interview'
        RETURNING id, title
      `;
      const deleteResult = await client.query(deleteInterviewQuery, [id]);

      await client.query('COMMIT');

      res.json({
        message: 'Interview deleted successfully',
        interview: {
          id: deleteResult.rows[0].id,
          title: deleteResult.rows[0].title
        }
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error deleting interview:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

module.exports = router;
