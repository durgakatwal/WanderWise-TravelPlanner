import useApi from "@/hooks/useApi";
import React from "react";
import Loading from "../shared/Loading";
import {
  Package,
  Plus,
  MapPin,
  Calendar,
  Clock,
  Edit,
  Trash2,
  MapIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../ui/card";
import { Badge } from "@/components/ui/badge";

const ItinerarySection = ({ selectedTripId, trips }) => {
  const {
    data: itineraries,
    loading,
    error,
  } = useApi(`/itineraries/${selectedTripId}`, {}, [selectedTripId]);

  const selectedTrip = trips.find((item) => item._id == selectedTripId);

  const getDaysArray = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d).toISOString().split("T")[0]);
    }

    return days;
  };

  if (loading) return <Loading />;
  if (error) return <div>{error}</div>;
  return (
    <section>
      <div className="space-y-4">
        {itineraries.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No items found
              </h3>
              <p className="text-gray-600 mb-4">
                Start adding activities to your itinerary
              </p>
              <a href={`/itineraries/add?tripId=${selectedTripId}`}>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Item
                </Button>
              </a>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Trip Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex gap-1 items-center text-2xl">
                    <MapIcon className="mr-2 h-5 w-5" />
                    {selectedTrip?.title}
                  </div>

                  <div>
                    {new Date(selectedTrip.startDate).toLocaleDateString()} -{" "}
                    {new Date(selectedTrip.endDate).toLocaleDateString()}
                  </div>
                </CardTitle>
                <CardDescription>{selectedTrip?.description}</CardDescription>
              </CardHeader>
            </Card>

            <div className="mb-6 flex justify-end">
              <a href={`/itineraries/add?tripId=${selectedTripId}`}>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Itinerary Item
                </Button>
              </a>
            </div>

            {/* Itinerary Days */}
            <div className="space-y-6">
              {getDaysArray(selectedTrip.startDate, selectedTrip.endDate).map(
                (day) => {
                  const dayItinerary = itineraries?.find(
                    (item) => item.date.split("T")[0] === day
                  );
                  const dayItems = dayItinerary?.activities || [];

                  return (
                    <Card key={day}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <h3>{dayItinerary?.title}</h3>
                          <div className="flex items-center">
                            {dayItems?.length !== 0 && (
                              <a
                                href={`/itineraries/edit/${dayItinerary?._id}?tripId=${selectedTripId}&date=${day}`}
                                className="mr-6"
                              >
                                <Button variant="outline">
                                  <Edit className="h-4 w-4" />
                                  Manage
                                </Button>
                              </a>
                            )}

                            <Calendar className="mr-2 h-5 w-5" />
                            {new Date(day).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {dayItems.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>No activities planned for this day</p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 bg-transparent"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add Activity
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {dayItems
                              .sort((a, b) => a.time.localeCompare(b.time))
                              .map((item) => (
                                <div
                                  key={item.name}
                                  className="flex items-start space-x-4 p-4 bg-white border rounded-lg"
                                >
                                  <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                                      <Clock className="h-4 w-4 text-blue-600" />
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm font-medium text-gray-900">
                                        {item?.time}
                                      </span>
                                    </div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                                      {item?.name}
                                    </h4>
                                    <ul className="space-y-1 list-disc pl-4 mt-2">
                                      {item?.notes.map((note, index) => {
                                        return (
                                          <li
                                            className="text-sm text-gray-600"
                                            key={index}
                                          >
                                            {note}
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                }
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ItinerarySection;
