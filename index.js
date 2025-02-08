import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

// Configure env
dotenv.config();

// Database Config
connectDB();

const app = express();
const server = http.createServer(app);

app.use(cors());

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const eventAttendees = {};

const userEventMap = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinEvent", async (eventId) => {
    if (userEventMap[socket.id] === eventId) return;

    userEventMap[socket.id] = eventId;

    if (!eventAttendees[eventId]) eventAttendees[eventId] = 0;
    eventAttendees[eventId]++;

    // Broadcast update to all clients
    io.emit("updateAttendees", { eventId, count: eventAttendees[eventId] });
  });

  socket.on("leaveEvent", async (eventId) => {
    if (userEventMap[socket.id] === eventId) {
      delete userEventMap[socket.id];

      if (eventAttendees[eventId] && eventAttendees[eventId] > 0) {
        eventAttendees[eventId]--;
      }

      // Broadcast update
      io.emit("updateAttendees", { eventId, count: eventAttendees[eventId] });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // Handle disconnection: Reduce count if they were in an event
    const eventId = userEventMap[socket.id];
    if (eventId && eventAttendees[eventId] && eventAttendees[eventId] > 0) {
      eventAttendees[eventId]--;
      io.emit("updateAttendees", { eventId, count: eventAttendees[eventId] });
    }

    delete userEventMap[socket.id]; // Cleanup
  });
});

// Middleware
app.use(express.json());

// Routes
app.use("/eventApp/api/auth", authRoutes);
app.use("/eventApp/api/events", eventRoutes);

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
