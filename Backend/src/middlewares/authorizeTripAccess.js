import Trip from "../models/TripPlanning.js";

export const authorizeTripAccess = async (tripId, userId) => {
  const trip = await Trip.findById(tripId).select("user collaborators");
  if (!trip) return { ok: false, reason: "TRIP_NOT_FOUND" };

  const isOwner = String(trip.user) === String(userId);
  const isCollab = trip.collaborators?.some(
    (c) => String(c) === String(userId)
  );

  if (!isOwner && !isCollab) return { ok: false, reason: "FORBIDDEN" };
  return { ok: true, trip };
};
