import Itinerary from "../models/itineraryTrip.js";
import Trip from "../models/TripPlanning.js";
import asyncHandler from "express-async-handler";

//add and create the itinerary
export const addItinerary = asyncHandler(async (req, res) => {
  const { title, description, activities, date } = req.body;

  const trip = await Trip.findOne({
    _id: req.params.tripId,
    user: req.user.userId,
  });
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  if (new Date(date) < trip.startDate || new Date(date) > trip.endDate) {
    res.status(400);
    throw new Error("Itinerary date should be within the trip date range");
  }

  const itinerary = await Itinerary.create({
    trip: req.params.tripId,
    title,
    description,
    activities,
    date,
  });
  res.status(201).json(itinerary);
});

export const getAllItinerary = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({
    _id: req.params.tripId,
    user: req.user.userId,
  });

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  const itineraries = await Itinerary.find({
    trip: req.params.tripId,
  });

  res.status(200).json(itineraries);
});

// Get itinerary for a trip by id
export const getItinerary = asyncHandler(async (req, res) => {
  const { tripId } = req.params;

  const itineraryItems = await Itinerary.find({ trip: tripId });

  if (!itineraryItems.length) {
    return res
      .status(404)
      .json({ message: "No itinerary found for this trip" });
  }

  res.json({ itinerary: itineraryItems });
});

//Update the itinerary
export const updateItinerary = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({
    _id: req.params.tripId,
    user: req.user.userId,
  });

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  if (req.body.date) {
    if (
      new Date(req.body.date) < trip.startDate ||
      new Date(req.body.date) > trip.endDate
    ) {
      res.status(400);
      throw new Error("Itinerary date should be within the trip date range");
    }
  }

  const updateData = {};
  if (req.body.title) updateData.title = req.body.title;
  if (req.body.description) updateData.description = req.body.description;
  if (req.body.activities) updateData.activities = req.body.activities;
  if (req.body.date) updateData.date = req.body.date;

  const itinerary = await Itinerary.findOneAndUpdate(
    { _id: req.params.id, trip: req.params.tripId },
    updateData,
    { new: true }
  );

  if (!itinerary) {
    res.status(404);
    throw new Error("Itinerary not found");
  }

  res.status(200).json(itinerary);
});

// Delete itinerary
export const deleteItinerary = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({
    _id: req.params.tripId,
    user: req.user.userId,
  });

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  const itinerary = await Itinerary.findOneAndDelete({
    _id: req.params.id,
    trip: req.params.tripId,
  });

  if (!itinerary) {
    res.status(404);
    throw new Error("Itinerary not found");
  }

  res.status(200).json(itinerary);
});
