import * as eventService from "../services/eventService.js";

export const createNewEventController = async (req, res) => {
  const {
    title,
    description,
    date,
    time,
    category,
    status,
    duration,
    createdBy,
  } = req.body;

  try {
    const result = await eventService.createNewEvent({
      title,
      description,
      date,
      time,
      category,
      status,
      duration,
      createdBy,
    });
    if (result.success) {
      return res.status(201).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to get All Events
export const getAllEventsController = async (req, res) => {
  try {
    const result = await eventService.getAllEvents();
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// Controller to update Event
export const updateEventController = async (req, res) => {
  const { eventId } = req.params;
  const updateData = req.body;
  updateData.eventId = eventId;
  try {
    const result = await eventService.updateEvent(updateData);
    if (result.success) {
      return res.status(result.status).json(result); // Send success response
    } else {
      return res.status(result.status).json(result); // Send error response
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to delete event
export const getEventByIdController = async (req, res) => {
  const { eventId } = req.params;

  try {
    const result = await eventService.getEventById(eventId);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// Controller to delete event
export const deleteEventController = async (req, res) => {
  const { eventId } = req.params;

  try {
    const result = await eventService.deleteEvent(eventId); // Pass the ID to deleteEvent function

    if (result.success) {
      return res.status(200).json(result); // Respond with success
    } else {
      return res.status(400).json(result); // Handle error
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
