import useApi from "@/hooks/useApi";
import React from "react";
import Loading from "../shared/Loading";
import {
  Package,
  Plus,
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
} from "../ui/card";

const ItinerarySection = ({ selectedTripId }) => {
  const {
    data: itineraries,
    loading,
    error,
  } = useApi(`/itineraries/${selectedTripId}`);
  const { data: trip } = useApi(`/trips/${selectedTripId}`);

  if (loading) return <Loading />;
  if (error) return <div>{error}</div>;

  if (!trip) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Trip not found
          </h3>
        </CardContent>
      </Card>
    );
  }

  const getDaysArray = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d).toISOString().split("T")[0]);
    }

    return days;
  };

  const days = getDaysArray(trip.startDate, trip.endDate);

  return (
    <section>
      <div className="space-y-6">
        {/* Trip Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex gap-1 items-center">
                <MapIcon className="mr-2 h-5 w-5" />
                {trip.title}
              </div>

              <div>
                {new Date(trip.startDate).toLocaleDateString()} -{" "}
                {new Date(trip.endDate).toLocaleDateString()}
              </div>
            </CardTitle>
            <CardDescription>{trip?.description}</CardDescription>
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
          {days.map((day) => {
            const dayItineraries = itineraries.filter(
              (item) => item.date.split("T")[0] === day
            );

            return (
              <Card key={day}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <h3>
                      {new Date(day).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </h3>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dayItineraries.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No activities planned for this day</p>
                      <a href={`/itineraries/add?tripId=${selectedTripId}`}>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Activity
                        </Button>
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {dayItineraries.map((itinerary) =>
                        itinerary.activities
                          .sort((a, b) => a.time.localeCompare(b.time))
                          .map((activity, index) => (
                            <div
                              key={index}
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
                                    {activity.time}
                                  </span>
                                  <div className="flex items-center space-x-2">
                                    <a
                                      href={`/itineraries/edit/${itinerary._id}?tripId=${selectedTripId}`}
                                    >
                                      <Button variant="outline" size="icon">
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    </a>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() =>
                                        console.log(
                                          "delete activity",
                                          itinerary._id,
                                          activity._id
                                        )
                                      }
                                    >
                                      <Trash2 className="h-4 w-4 text-red-600" />
                                    </Button>
                                  </div>
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                                  {activity.name}
                                </h4>
                                <ul className="space-y-1 list-disc pl-4 mt-2">
                                  {activity.notes?.map((note, i) => (
                                    <li
                                      key={i}
                                      className="text-sm text-gray-600"
                                    >
                                      {note}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ItinerarySection;

// import useApi from "@/hooks/useApi";
// import React from "react";
// import Loading from "../shared/Loading";
// import { Plus, Calendar, Clock, Edit, Trash2, MapIcon } from "lucide-react";
// import { Button } from "../ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "../ui/card";

// const ItinerarySection = ({ selectedTripId }) => {
//   const {
//     data: itineraries,
//     loading,
//     error,
//   } = useApi(`/itineraries/${selectedTripId}`);
//   const { data: trip } = useApi(`/trips/${selectedTripId}`);

//   if (loading) return <Loading />;
//   if (error) return <div>{error}</div>;

//   if (!trip) {
//     return (
//       <Card>
//         <CardContent className="text-center py-12">
//           <h3 className="text-lg font-medium text-gray-900 mb-2">
//             Trip not found
//           </h3>
//         </CardContent>
//       </Card>
//     );
//   }

//   const getDaysArray = (startDate, endDate) => {
//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     const days = [];

//     for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
//       days.push(new Date(d).toISOString().split("T")[0]);
//     }

//     return days;
//   };

//   const days = getDaysArray(trip.startDate, trip.endDate);

//   return (
//     <section>
//       <div className="space-y-6">
//         {/* Trip Info */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center justify-between">
//               <div className="flex gap-1 items-center">
//                 <MapIcon className="mr-2 h-5 w-5" />
//                 {trip.title}
//               </div>

//               <div className="flex items-center gap-4">
//                 <span>
//                   {new Date(trip.startDate).toLocaleDateString()} -{" "}
//                   {new Date(trip.endDate).toLocaleDateString()}
//                 </span>
//                 {/* ✅ Global Add Button */}
//                 <a href={`/itineraries/add?tripId=${selectedTripId}`}>
//                   <Button size="sm">
//                     <Plus className="mr-2 h-4 w-4" /> Add Item
//                   </Button>
//                 </a>
//               </div>
//             </CardTitle>
//             <CardDescription>{trip?.description}</CardDescription>
//           </CardHeader>
//         </Card>

//         {/* Itinerary Days */}
//         <div className="space-y-6">
//           {days.map((day) => {
//             const dayItineraries = itineraries.filter(
//               (item) => item.date.split("T")[0] === day
//             );

//             if (dayItineraries.length === 0) return null;

//             return (
//               <Card key={day}>
//                 <CardHeader>
//                   <CardTitle className="flex items-center justify-between">
//                     <h3>
//                       {new Date(day).toLocaleDateString("en-US", {
//                         weekday: "long",
//                         year: "numeric",
//                         month: "long",
//                         day: "numeric",
//                       })}
//                     </h3>

//                     {/* ✅ Per-Day Add Button */}
//                     <a
//                       href={`/itineraries/add?tripId=${selectedTripId}&date=${day}`}
//                     >
//                       <Button variant="outline" size="sm">
//                         <Plus className="mr-2 h-4 w-4" /> Add Activity
//                       </Button>
//                     </a>
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     {dayItineraries.map((itinerary) =>
//                       itinerary.activities
//                         .sort((a, b) => a.time.localeCompare(b.time))
//                         .map((activity, index) => (
//                           <div
//                             key={index}
//                             className="flex items-start space-x-4 p-4 bg-white border rounded-lg"
//                           >
//                             <div className="flex-shrink-0">
//                               <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
//                                 <Clock className="h-4 w-4 text-blue-600" />
//                               </div>
//                             </div>
//                             <div className="flex-1 min-w-0">
//                               <div className="flex items-center justify-between mb-2">
//                                 <span className="text-sm font-medium text-gray-900">
//                                   {activity.time}
//                                 </span>
//                                 <div className="flex items-center space-x-2">
//                                   <a
//                                     href={`/itineraries/edit/${itinerary._id}?tripId=${selectedTripId}`}
//                                   >
//                                     <Button variant="outline" size="icon">
//                                       <Edit className="h-4 w-4" />
//                                     </Button>
//                                   </a>
//                                   <Button
//                                     variant="outline"
//                                     size="icon"
//                                     onClick={() =>
//                                       console.log(
//                                         "delete activity",
//                                         itinerary._id,
//                                         activity._id
//                                       )
//                                     }
//                                   >
//                                     <Trash2 className="h-4 w-4 text-red-600" />
//                                   </Button>
//                                 </div>
//                               </div>
//                               <h4 className="text-lg font-semibold text-gray-900 mb-1">
//                                 {activity.name}
//                               </h4>
//                               <ul className="space-y-1 list-disc pl-4 mt-2">
//                                 {activity.notes?.map((note, i) => (
//                                   <li key={i} className="text-sm text-gray-600">
//                                     {note}
//                                   </li>
//                                 ))}
//                               </ul>
//                             </div>
//                           </div>
//                         ))
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ItinerarySection;
