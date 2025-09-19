//day 6
import asyncHandler from "express-async-handler";
import PackageList from "../models/packageList.js";
import Trip from "../models/TripPlanning.js";

//API 1: CREATE
const create = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const trip = await Trip.findOne({
    _id: req.params.tripId,
    user: req.user.userId,
  });
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }
  const packageList = await PackageList.create({
    name,
    trip: trip._id,
    user: req.user.userId,
  }); //created the api
  res.status(201).json(packageList);
});

//API 2: GET (all)
const findAll = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({
    _id: req.params.tripId,
    user: req.user.userId,
  });
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  const packageLists = await PackageList.find({
    trip: req.params.tripId,
  });
  res.status(200).json(packageLists);
});

//API 3:GET(specific)
const findById = asyncHandler(async (req, res) => {
  const { id, tripId } = req.params;
  const trip = await Trip.findOne({
    _id: tripId,
    user: req.user.userId,
  });
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  const packageList = await PackageList.findOne({
    _id: id,
    trip: req.params.tripId,
    user: req.user.userId,
  });
  if (!packageList) {
    res.status(404);
    throw new Error("PackageList not found");
  }
  res.status(200).json(packageList);
});

//API 4:PATCH(update)
const update = asyncHandler(async (req, res) => {
  const { id, tripId } = req.params;
  const trip = await Trip.findOne({
    _id: req.params.tripId,
    user: req.user.userId,
  });
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  const packageList = await PackageList.findOneAndUpdate(
    {
      _id: id,
      trip: tripId,
      user: req.user.userId,
    },

    {
      ...(req.body.name && { name: req.body.name }),
      ...(req.body.completed !== undefined && {
        //conditiinal check if the completed is updated or not if yes then it goes diwn if not then nothing
        completed: req.body.completed,
      }),
    },
    { new: true } //return the updated data/document ...here we have updated the name so it displays the new name but if we don't run this then in response we get same old data
  );
  if (!packageList) {
    res.status(404);
    throw new Error("PackageList not found");
  }
  res.status(200).json(packageList);
});

//API 5:DELETE(remove)
const remove = asyncHandler(async (req, res) => {
  const { id, tripId } = req.params;
  const trip = await Trip.findOne({
    _id: req.params.tripId,
    user: req.user.userId,
  });
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }
  const packageList = await PackageList.findOneAndDelete({
    _id: id,
    trip: tripId,
    user: req.user.userId,
  });
  if (!packageList) {
    res.status(404);
    throw new Error("PackageList not found");
  }
  res.status(200).json({ message: "Package list deleted" });
});

export { create, findAll, findById, update, remove };
