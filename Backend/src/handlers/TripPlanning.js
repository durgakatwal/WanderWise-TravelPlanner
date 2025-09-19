import { Router } from "express";
import {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  addExpenses,
  inviteCollaborator,
  acceptInvitation,
  createReview,
  getAllTripsReviews,
  deleteReview,
  uploadFiles,
  deleteFile,
} from "../services/TripPlanning.js";
import { useValidator } from "../middlewares/useValidator.js";
import {
  createTripValidator,
  inviteCollaboratorValidator,
} from "../validators/TripPlanning.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import multer from "multer";

const router = Router();

const upload = multer({ dest: "uploads/" });

router.post("/", useValidator(createTripValidator), createTrip);
router.get("/", getAllTrips);
router.get("/:id", getTripById);
router.put("/:id", updateTrip);
router.delete("/:id", deleteTrip);
router.post("/:id/expenses", addExpenses);
router.post(
  "/:id/invite",
  useValidator(inviteCollaboratorValidator),
  inviteCollaborator
);
router.get("/:id/invite/accept", acceptInvitation);

router.post("/:id/reviews", authMiddleware, createReview); //tripid /reviews
router.get("/:id/reviews", authMiddleware, getAllTripsReviews); //tripid/reviews
router.delete("/:tripId/reviews/:reviewId", authMiddleware, deleteReview); //reviews/reviewid

router.post("/:id/files", upload.array("files"), uploadFiles);
router.delete("/:id/files", deleteFile);

export default router;
