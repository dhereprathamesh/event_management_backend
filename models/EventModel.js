import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({ 
    title: { type: String, required: true }, 
    description: { type: String }, 
    date: { type: String }, 
    time: { type: String },
    duration: { type: String },
    category: { type: String },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
    attendeesCount: { type: Number, default: 0},
    status: {  type: String, default: 'Upcoming' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
});
export const Event = mongoose.model("Event", EventSchema);
