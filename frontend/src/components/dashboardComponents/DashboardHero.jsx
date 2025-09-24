import React from "react";
import { Button } from "../ui/button";

const DashboardHero = () => {
  return (
    <section className="relative flex items-center justify-center text-white">
      <div className="absolute top-0 left-0 w-full h-full -z-20 overflow-hidden grid place-content-center">
        {/* <img
          src="https://res.cloudinary.com/ybmedia/image/upload/c_crop,h_1125,w_2000,x_0,y_40/c_fill,f_auto,h_900,q_auto,w_1600/v1/m/6/8/68dbbf89e8e397f36bc350ce3846206b37712d77/20-dream-worthy-vacation-destinations.jpg"
          alt="background"
          className="w-full h-auto "
        /> */}

        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          src="/travel.mp4"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute h-full w-full top-0 left-0 bg-black/60 -z-10"></div>

      <div className="flex flex-col items-center justify-center text-center gap-10 min-h-[60vh] max-w-2/3 px-4">
        <h1 className="text-3xl md:text-5xl font-bold">
          Create new trip with Wander Wise
        </h1>

        <div className="flex items-center gap-4">
          <a href="/trips/add">
            <Button size={"lg"}>Create Trip</Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default DashboardHero;
