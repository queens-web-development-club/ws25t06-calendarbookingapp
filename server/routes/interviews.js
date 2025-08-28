const express = require('express');
const router = express.Router();
const pool = require('../db');
const { generateTimeSlots } = require('../utils/timeSlotGenerator');

// POST /api/interviews - Create a new interview event
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      duration,
      location,
      maxBookings,
    } = req.body;

    // Validate required fields
    if (!title || !duration || !maxBookings ) {
      return res.status(400).json({
        error: 'Missing required fields: title, duration, maxBookings are required'
      });
    }

    // Create settings object with interview-specific data
    const settings = {
      duration: parseInt(duration) || 30,
      location: location || '',
      maxBookings: parseInt(maxBookings) || 5,
      type: 'interview'
    };

    // Insert into events table
    const query = `
      INSERT INTO events (title, description, type, settings)
      VALUES ($1, $2, $3, $4)
      RETURNING id, title, description, type, settings, created_at
    `;

    const values = [
      title,
      description || '',
      'interview',
      JSON.stringify(settings)
    ];

    const result = await pool.query(query, values);
    const newInterview = result.rows[0];

    // Note: Time slots will be created separately via the /timeslots/batch endpoint
    // using the user's selected slots, not auto-generated ones

    res.status(201).json({
      message: 'Interview created successfully',
      interview: {
        id: newInterview.id,
        title: newInterview.title,
        description: newInterview.description,
        organizerName: "",
        organizerEmail: "",
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
