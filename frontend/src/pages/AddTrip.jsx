// import { AddTripForm } from "@/components/trips/AddTripForm";
import { TripForm } from "@/components/trips/TripForm";
import React from "react";

const AddTrip = () => {
  return (
    <main className="px-20 py-6 bg-gray-50">
      <section className="border rounded-md p-6 max-w-2xl mx-auto bg-white">
        <div>
          <h1 className="text-2xl font-bold">Add Your Trip</h1>
          <p className="text-sm text-gray-400">
            Plan your next Adventure with WanderWise!
          </p>
        </div>
        <section className="mt-6">
          <TripForm />
        </section>
      </section>
    </main>
  );
};

export default AddTrip;
