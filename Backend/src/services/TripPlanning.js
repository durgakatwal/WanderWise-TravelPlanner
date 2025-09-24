import asyncHandler from "express-async-handler";
import Trip from "../models/TripPlanning.js";
import { sendMail } from "../utils/sendMail.js";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// CREATE a new trip
export const createTrip = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const trip = await Trip.create({ ...req.body, user: userId });
  res.status(201).json(trip);
});
// READ all trips of the user
export const getAllTrips = asyncHandler(async (req, res) => {
  const trips = await Trip.find({
    $or: [
      { user: req.user.userId },
      { collaborators: req.user.userId },
      // { collaborators: {$in:[req.user.userId] }},   //this is used for the indexing and finding the elements from the array
    ],
  });
  res.status(200).json(trips);
});

// READ trip by ID
export const getTripById = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({
    _id: req.params.id,
    $or: [{ user: req.user.userId }, { collaborators: req.user.userId }],
  })
    .populate("user", "name email")
    .populate("collaborators", "name email");
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }
  res.status(200).json(trip);
});

// UPDATE trip
export const updateTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findOneAndUpdate(
    { _id: req.params.id, user: req.user.userId },
    {
      ...(req.body.title && { title: req.body.title }),
      ...(req.body.startDate && { startDate: req.body.startDate }),
      ...(req.body.endDate && { endDate: req.body.endDate }),
      ...(req.body.destination && { destination: req.body.destination }),
      ...(req.body.budget && { budget: req.body.budget }),
      ...(req.body.transport && { transport: req.body.transport }),
      ...(req.body.accommodation && { accommodation: req.body.accommodation }),
      ...(req.body.notes && { notes: req.body.notes }),
      ...(req.body.status && { status: req.body.status }),
      ...(req.body.budget && { budget: req.body.budget }),
    },
    { new: true }
  );
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }
  res.status(200).json(trip);
});

// DELETE trip
export const deleteTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findOneAndDelete({
    _id: req.params.id,
    user: req.user.userId,
  });
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }
  res.status(200).json({ message: "Trip deleted successfully" });
});

export const addExpenses = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({
    _id: req.params.id,
    $or: [{ user: req.user.userId }],
  });

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  const date = req.body.date || new Date();
  trip.budget.expenses.push({
    ...req.body,
    date,
  });

  trip.budget.spent += req.body.amount || 0;
  await trip.save();

  res.status(200).json(trip);
});

export const inviteCollaborator = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({
    _id: req.params.id,
    user: req.user.userId,
  }).populate("user", "name"); //this indicates the in the trip request user details is shown and we can choose which data can be fetch here from user table name is shown in the request here we can also make show for other field like email for this we can  .populate("user","name email")

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }
  // console.log(req.body.email);
  const token = jwt.sign({ tripId: req.params.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  const invitationLink = `http://localhost:5173/trips/${trip._id}/invite/accept?token=${token}`;
  await sendMail(req.body.email, "Invitation to collaborate", {
    title: trip.title,
    startDate: trip.startDate.toDateString(),
    endDate: trip.endDate.toDateString(),
    userName: trip.user.name,
    link: invitationLink,
  });
  res.status(200).json({ message: "Invitation sent successfully" });
});

export const acceptInvitation = asyncHandler(async (req, res) => {
  const { token } = req.query;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const trip = await Trip.findById(decoded.tripId);
  if (!trip) {
    res.status(404);
    throw new Error("trip not found");
  }
  // prevent duplicates
  const alreadyAdded = trip.collaborators.some(
    (collab) => collab.toString() === req.user.userId
  );

  if (alreadyAdded) {
    return res.status(400).json({ message: "You are already a collaborator" });
  }

  trip.collaborators.push(req.user.userId);
  await trip.save();
  res.status(200).json({ message: "Invitation accepted successfully" });
});

export const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const trip = await Trip.findOne({
    _id: req.params.id,
    $or: [{ user: req.user.userId }, { collaborators: req.user.userId }],
  });
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }
  //check if already reviewed
  const alreadyReviewed = trip.reviews.find((review) => {
    return review.user.toString() === req.user.userId;
  });
  if (alreadyReviewed) {
    res.status(400);
    throw new Error("You have already reviewed this Trip");
  }

  //save review
  const review = {
    user: req.user.userId,
    rating,
    comment,
  };
  trip.reviews.push(review);
  await trip.save();
  res.status(201).json(review);
});

//get all the reviews from the trip
export const getAllTripsReviews = asyncHandler(async (req, res) => {
  const { id } = req.params;

  console.log("Fetching trip with ID:", id);

  const trip = await Trip.findById(id).populate("reviews.user", "name email");

  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  // Return only the reviews part, or the whole trip?
  res.status(200).json(trip.reviews); //  Better: return just reviews
});
//delete review
export const deleteReview = asyncHandler(async (req, res) => {
  const { tripId, reviewId } = req.params;

  const trip = await Trip.findById(tripId);
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  const review = trip.reviews.id(reviewId);
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  // Check ownership
  if (review.user.toString() !== req.user.userId) {
    res.status(403);
    throw new Error("Not authorized to delete this review");
  }

  // Use pull to remove the review by ID
  trip.reviews.pull(reviewId); // This removes the subdoc from the array

  await trip.save();

  res.status(200).json({ message: "Review deleted successfully" });
});

//uploading and posting the images in cloudinary
export const uploadFiles = asyncHandler(async (req, res) => {
  let files = [];
  const trip = await Trip.findOne({
    _id: req.params.id,
    $or: [{ user: req.user.userId }, { collaborators: req.user.userId }],
  });
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }
  if (req.files.length > 4) {
    res.status(400);
    throw new Error("You can only upload up to 4 files");
  }
  await Promise.all(
    req.files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto",
        folder: `wander-wise/trips/${trip.title}_${trip._id}`,
        overwrite: false,
        use_filename: true,
        unique_filename: true,
      });

      files.push({
        url: result.secure_url,
        publicId: result.public_id,
      });
      fs.unlinkSync(file.path);
    })
  );

  if (files.length) {
    trip.files = files;
    await trip.save();
  }
  res.status(200).json(trip);
});

export const deleteFile = asyncHandler(async (req, res) => {
  const { id, fileId } = req.params;

  const trip = await Trip.findOne({
    _id: id,
    $or: [{ user: req.userId }, { collaborators: req.user.userId }],
  });

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  const file = trip.files?.find((f) => f._id.toString() === fileId);
  if (!file) {
    res.status(404);
    throw new Error("File not found");
  }

  await cloudinary.uploader.destroy(file.publicId);
  trip.files = trip.files?.filter((f) => f._id.toString() !== fileId);
  await trip.save();
  res.status(200).json({ message: "File deleted successfully" });
});
