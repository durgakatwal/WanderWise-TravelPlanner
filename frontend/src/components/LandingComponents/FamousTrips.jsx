import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "../ui/card";
import { famousTrips } from "@/lib/constants";
import { Button } from "../ui/button";

const FamousTrips = () => {
  return (
    <section className="py-20 px-10 " id="trips">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Famous Trips</h1>
          <p className="text-lg mt-2">
            Some of the most popular trips planned with Wander Wise.
          </p>
        </div>

        {/* the below tailwind css is used for responsiveness md means for tablet the feature card will be two and for lg means lapto the feature card will be 4  if no any responsiveness is given for mobile i.e in mobile we have to show single card in col so if we didn't set any responsiveness it automatically set grid-cols-1*/}
        <div className=" grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {famousTrips.map((trip) => {
            return (
              <Card
                key={trip.place}
                className={"shadow-md hover:shadow-lg transition"}
              >
                <CardHeader>
                  <div className="h-60 w-full overflow-hidden">
                    <img
                      src={trip.image}
                      alt={trip.place}
                      className="h-full w-full"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-bold mb-2">{trip.place}</p>
                  <CardDescription
                    className={"flex items-center justify-between"}
                  >
                    <p className="text-lg text-gray-600">{trip.days} days</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {trip.budget} USD
                    </p>
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button className={"w-full"}>View Details</Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FamousTrips;
