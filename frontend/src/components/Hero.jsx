import React from "react";
import { Button } from "./ui/button";

function Hero() {
  return (
    <section className="grid grid-cols-2 items-center gap-10 p-20">
      {/* left part where paragraph is present */}
      <div>
        <h1 className="text-4xl font-extrabold">
          Manage Your Trip with WanderWise
        </h1>
        <p className="mt-8">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro
          mollitia quae saepe atque? Doloremque soluta laborum cumque quae
          voluptate earum non! Non deleniti modi velit eligendi aspernatur sed
          labore deserunt! Eum harum obcaecati numquam reprehenderit facere,
          tempora voluptates nam sunt, dolores modi, facilis perferendis nihil.
        </p>
        <Button className="mt-8">Book Trip</Button>
      </div>
      {/* right part where image is present */}
      <div className="flex justify-center items-center">
        <img
          src="/vite.svg"
          alt="hero image"
          srcset=""
          className="w-100 h-100"
        />
      </div>
    </section>
  );
}

export default Hero;
