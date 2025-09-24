import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import useApi from "@/hooks/useApi";
import Loading from "../shared/Loading";

const TripStatusCards = () => {
  const { data: trips, loading, error } = useApi("/trips");

  if (loading) return <Loading />;
  if (error) return <p>Error loading trips</p>;
  const calculateTripStats = (trips) => {
    const today = new Date();
    let ongoing = 0,
      upcoming = 0,
      completed = 0;

    trips.forEach((trip) => {
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);

      if (today < start) {
        upcoming++;
      } else if (today >= start && today <= end) {
        ongoing++;
      } else if (today > end) {
        completed++;
      }
    });

    return { ongoing, upcoming, completed };
  };

  const { ongoing, upcoming, completed } = calculateTripStats(trips);
  return (
    <section className="my-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-4xl font-semibold">{trips?.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ongoing Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-4xl font-semibold">{ongoing}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-4xl font-semibold">{upcoming}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completed Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-4xl font-semibold">{completed}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TripStatusCards;
