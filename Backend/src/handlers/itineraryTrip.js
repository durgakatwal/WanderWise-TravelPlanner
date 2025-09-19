import express from "express";
import {
  addItinerary,
  getAllItinerary,
  getItinerary,
  updateItinerary,
  deleteItinerary,
} from "../services/itineraryTrip.js";
import { createItineraryValidator } from "../validators/itineraryTrip.js";
import { useValidator } from "../middlewares/useValidator.js";

const router = express.Router();

router.post("/:tripId", useValidator(createItineraryValidator), addItinerary);
router.get("/:tripId", getAllItinerary);
router.get("/:tripId/:id", getItinerary);
router.patch("/:tripId/:id", updateItinerary);
router.delete("/:itineraryId", deleteItinerary);

export default router;
