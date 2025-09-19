import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { features } from "@/lib/constants";

const Features = () => {
  return (
    <section className="py-20 px-10 " id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose Wander Wise?
          </h2>
          <p className="text-lg mt-2">
            We provide everything you need to plan, book, and enjoy your perfect
            trip
          </p>
        </div>

        {/* the below tailwind css is used for responsiveness md means for tablet the feature card will be two and for lg means lapto the feature card will be 4  if no any responsiveness is given for mobile i.e in mobile we have to show single card in col so if we didn't set any responsiveness it automatically set grid-cols-1*/}
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            return (
              <Card
                key={feature.title}
                className="text-center shadow-md hover:shadow-lg transition"
              >
                <CardHeader>
                  <feature.icon
                    className={`h-12 w-12 mx-auto mb-4 ${feature.color}`}
                  />
                  <CardTitle className={`text-xl`}>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
