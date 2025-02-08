import { Event } from "../models/EventModel.js";
import { User } from "../models/UserModel.js";
import moment from "moment-timezone";

export const createNewEvent = async (eventData) => {
  try {
    const {
      title,
      description,
      date,
      time,
      category,
      status,
      duration,
      createdBy,
    } = eventData;

    // Validation
    if (!title) throw new Error("Event Title is required");
    if (!date) throw new Error("Event Date is required");
    if (!time) throw new Error("Event Date is required");
    if (!category) throw new Error("Event Date is required");
    if (!createdBy) throw new Error("Created By is required");

    // Find the user by userName
    const user = await User.findById(createdBy);
    if (!user) {
      return {
        status: 404,
        data: {
          success: false,
          message: `User with userName '${createdBy}' not found.`,
        },
      };
    }

    var eventStatus = "Upcoming";
    // Combine date and time strings into a valid format for JavaScript's Date constructor
    const eventDateTimeString = `${date} ${time}`;
    const eventDateTime = moment
      .utc(eventDateTimeString, "DD-MM-yyyy HH:mm")
      .toDate();
    const eventEndTime = moment
      .utc(eventDateTimeString, "DD-MM-yyyy HH:mm")
      .add(2, "hours")
      .toDate();

    // Custom logic to determine the status
    const timeZone = moment.tz("Asia/Kolkata");
    console.log(timeZone.format("YYYY-MM-DDTHH:mm:ss"));

    // Convert it to a JavaScript Date object, but it will be in local system timezone
    const now = moment
      .utc(timeZone.format("YYYY-MM-DDTHH:mm:ss"), "YYYY-MM-DDTHH:mm:ss")
      .toDate();

    // Compare the current time with the event date
    if (eventDateTime < now && now < eventEndTime) {
      eventStatus = "Live"; // Event is in the past
    } else if (eventEndTime < now) {
      eventStatus = "Ended"; // Event is in the future
    }

    // Create new event instance
    const newEvent = new Event({
      title: title,
      description: description,
      date: date,
      time: time,
      category: category,
      status: eventStatus,
      duration: duration,
      createdBy: user._id,
    });

    // Save event
    await newEvent.save();

    return {
      success: true,
      message: "Event created successfully",
      event: newEvent,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error.message || "Error creating new event",
    };
  }
};

//get all events
export const getAllEvents = async () => {
  try {
    const events = await Event.find(); // Fetch all events
    return {
      success: true,
      events, // Return the list of events
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error.message || "Error retrieving events",
    };
  }
};

export const updateEvent = async (updateData) => {
  try {
    const { eventId } = updateData; // Get eventId from updateData

    if (!eventId) throw new Error("Event ID is required");

    // Find the event by eventId
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId, // Use the eventId from URL
      { $set: updateData }, // Update only the provided fields
      { new: true, runValidators: true } // Return updated doc and run validation
    );

    if (!updatedEvent) throw new Error("Event not found");

    return {
      success: true,
      status: 200,
      message: "Event updated successfully",
      updatedEvent,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      status: 400,
      message: error.message || "Error updating event",
    };
  }
};

export const getEventById = async (eventId) => {
  try {
    if (!eventId) throw new Error("Event ID is required");

    const event = await Event.findById(eventId);

    if (!event) {
      return {
        success: false,
        status: 404,
        message: "Event not found",
      };
    }

    return {
      success: true,
      status: 200,
      event,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      status: 400,
      message: error.message || "Error retrieving event",
    };
  }
};

export const deleteEvent = async (id) => {
  try {
    if (!id) throw new Error("Event ID is required");

    const event = await Event.findByIdAndDelete(id);
    if (!event) throw new Error("Event not found");

    return {
      success: true,
      message: "Event deleted successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error.message || "Error deleting event",
    };
  }
};
