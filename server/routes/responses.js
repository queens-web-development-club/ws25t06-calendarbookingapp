const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/responses - Create a new participant response
router.post('/', async (req, res) => {
  try {
    console.log('Received participant response:', req.body);
    console.log('Time slot IDs received:', timeSlotIds);
    console.log('Time slot IDs type:', typeof timeSlotIds);
    console.log('Time slot IDs is array:', Array.isArray(timeSlotIds));
    
    const {
      eventId,
      timeSlotIds, // Array of time slot IDs
      userName,
      userEmail
    } = req.body;

    // Validate required fields
    if (!eventId || !timeSlotIds || !userName || !userEmail) {
      return res.status(400).json({
        error: 'Missing required fields: eventId, timeSlotIds, userName, userEmail are required'
      });
    }

    // Validate that timeSlotIds is an array and not empty
    if (!Array.isArray(timeSlotIds) || timeSlotIds.length === 0) {
      return res.status(400).json({
        error: 'timeSlotIds must be a non-empty array'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    // Check if event exists and get its type
    const eventQuery = `
      SELECT id, type, title FROM events 
      WHERE id = $1 AND status = 'active'
    `;
    
    const eventResult = await pool.query(eventQuery, [eventId]);
    
    if (eventResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Event not found or not active'
      });
    }

    const event = eventResult.rows[0];

    // Validate that all time slots exist and belong to this event
    const timeSlotsQuery = `
      SELECT id, is_available FROM time_slots 
      WHERE id = ANY($1) AND event_id = $2
    `;
    
    const timeSlotsResult = await pool.query(timeSlotsQuery, [timeSlotIds, eventId]);
    console.log('Found time slots:', timeSlotsResult.rows);
    console.log('Expected count:', timeSlotIds.length, 'Actual count:', timeSlotsResult.rows.length);
    
    if (timeSlotsResult.rows.length !== timeSlotIds.length) {
      return res.status(400).json({
        error: 'One or more time slots not found or do not belong to this event'
      });
    }

    // Check if any time slots are already unavailable
    const unavailableSlots = timeSlotsResult.rows.filter(slot => !slot.is_available);
    if (unavailableSlots.length > 0) {
      return res.status(400).json({
        error: 'One or more selected time slots are no longer available'
      });
    }

    // For interviews, ensure only one time slot is selected
    if (event.type === 'interview' && timeSlotIds.length > 1) {
      return res.status(400).json({
        error: 'Interviews can only have one time slot selected'
      });
    }

    // Check if user has already responded to this event
    const existingResponseQuery = `
      SELECT id FROM responses 
      WHERE event_id = $1 AND user_email = $2
    `;
    
    const existingResponseResult = await pool.query(existingResponseQuery, [eventId, userEmail]);
    
    if (existingResponseResult.rows.length > 0) {
      return res.status(409).json({
        error: 'You have already responded to this event'
      });
    }

    // Begin transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Insert the response
      const insertResponseQuery = `
        INSERT INTO responses (event_id, time_slot_ids, user_name, user_email)
        VALUES ($1, $2, $3, $4)
        RETURNING id, event_id, time_slot_ids, user_name, user_email, created_at
      `;

      const insertResponseResult = await client.query(insertResponseQuery, [
        eventId,
        timeSlotIds,
        userName,
        userEmail
      ]);

      const newResponse = insertResponseResult.rows[0];

      // Mark time slots as unavailable
      console.log('Updating time slots to unavailable:', timeSlotIds);
      const updateTimeSlotsQuery = `
        UPDATE time_slots 
        SET is_available = false 
        WHERE id = ANY($1)
      `;

      const updateResult = await client.query(updateTimeSlotsQuery, [timeSlotIds]);
      console.log('Time slots updated:', updateResult.rowCount, 'rows affected');

      // Verify the update worked
      const verifyQuery = `
        SELECT id, is_available FROM time_slots 
        WHERE id = ANY($1)
      `;
      const verifyResult = await client.query(verifyQuery, [timeSlotIds]);
      console.log('Verification - time slots after update:', verifyResult.rows);

      await client.query('COMMIT');

      // Get the updated time slots for response
      const updatedTimeSlotsQuery = `
        SELECT id, start_time, end_time, is_available
        FROM time_slots 
        WHERE id = ANY($1)
        ORDER BY start_time ASC
      `;

      const updatedTimeSlotsResult = await pool.query(updatedTimeSlotsQuery, [timeSlotIds]);
      const selectedTimeSlots = updatedTimeSlotsResult.rows.map(slot => ({
        id: slot.id,
        startTime: slot.start_time,
        endTime: slot.end_time,
        isAvailable: slot.is_available
      }));

      res.status(201).json({
        message: 'Response submitted successfully',
        response: {
          id: newResponse.id,
          eventId: newResponse.event_id,
          eventTitle: event.title,
          eventType: event.type,
          timeSlotIds: newResponse.time_slot_ids,
          selectedTimeSlots,
          userName: newResponse.user_name,
          userEmail: newResponse.user_email,
          createdAt: newResponse.created_at
        }
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error creating participant response:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// GET /api/responses/event/:eventId - Get all responses for an event
router.get('/event/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;

    const query = `
      SELECT r.id, r.event_id, r.time_slot_ids, r.user_name, r.user_email, r.created_at,
             ts.id as slot_id, ts.start_time, ts.end_time
      FROM responses r
      LEFT JOIN LATERAL unnest(r.time_slot_ids) AS slot_id ON true
      LEFT JOIN time_slots ts ON ts.id = slot_id
      WHERE r.event_id = $1
      ORDER BY r.created_at DESC, ts.start_time ASC
    `;

    const result = await pool.query(query, [eventId]);
    
    // Group responses by participant
    const responses = {};
    result.rows.forEach(row => {
      if (!responses[row.id]) {
        responses[row.id] = {
          id: row.id,
          eventId: row.event_id,
          userName: row.user_name,
          userEmail: row.user_email,
          createdAt: row.created_at,
          timeSlots: []
        };
      }
      
      if (row.slot_id) {
        responses[row.id].timeSlots.push({
          id: row.slot_id,
          startTime: row.start_time,
          endTime: row.end_time
        });
      }
    });

    res.json({
      responses: Object.values(responses)
    });

  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

module.exports = router;
