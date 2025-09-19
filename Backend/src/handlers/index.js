import { Router } from "express";
import packageList from "./packageList.js";
import user from "./user.js";
import auth from "./auth.js";
import trip from "./TripPlanning.js";
import itenerary from "./itineraryTrip.js";
import chatRoutes from "./chat.js";

const router = Router();

router.use("/package-lists", packageList); //first features   //pacakgeList is the handler name and can be anything but while importing the name must be same
router.use("/users", user); //second features
router.use("/auth", auth);
router.use("/trips", trip);
router.use("/itineraries", itenerary);
router.use("/", chatRoutes);

export default router;
