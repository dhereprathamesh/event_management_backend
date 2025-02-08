import express from "express";
import {
  createNewEventController,
  deleteEventController,
  getAllEventsController,
  getEventByIdController,
  updateEventController,
} from "../controllers/eventController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add-event", requireSignIn, createNewEventController);
router.get("/getEventById/:eventId", getEventByIdController);
router.put("/update-event/:eventId", requireSignIn, updateEventController);
router.delete("/delete-event/:eventId", requireSignIn, deleteEventController);
router.get("/", getAllEventsController);

export default router;
