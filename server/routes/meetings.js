const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/meetings - Create a new meeting event
router.post('/', async (req, res) => {
  try {
    console.log('Received meeting creation request:', req.body);
    
    const {
      title,
      description,
      location,
      organizerEmail,
      organizerName,
      meetingType,
      startHour,
      endHour
    } = req.body;

    // Validate required fields
    if (!title || !startHour || !endHour || !meetingType) {
      return res.status(400).json({
        error: 'Missing required fields: title, startHour, endHour, meetingType are required'
      });
    }

    // Create settings object with meeting-specific data
    const settings = {
      startHour: parseInt(startHour),
      endHour: parseInt(endHour),
      meetingType: meetingType,
      location: location || ''
    };

    // Insert into events table
    const query = `
      INSERT INTO events (title, description, type, settings, organizer_email, organizer_name)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, title, description, type, settings, organizer_email, organizer_name, created_at, token
    `;

    const values = [
      title,
      description || '',
      'meeting',
      JSON.stringify(settings),
      organizerEmail || "",
      organizerName || ""
    ];

    const result = await pool.query(query, values);
    const newMeeting = result.rows[0];

    res.status(201).json({
      message: 'Meeting created successfully',
      meeting: {
        id: newMeeting.id,
        title: newMeeting.title,
        description: newMeeting.description,
        type: newMeeting.type,
        settings: JSON.parse(newMeeting.settings),
        organizerEmail: newMeeting.organizer_email,
        organizerName: newMeeting.organizer_name,
        createdAt: newMeeting.created_at,
        token: newMeeting.token
      }
    });

  } catch (error) {
    console.error('Error creating meeting:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

module.exports = router;
