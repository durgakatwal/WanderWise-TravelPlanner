import { ItineraryForm } from "@/components/itineraryComponents/ItineraryForm";
import React from "react";

const AddItinerary = () => {
  return (
    <main className="px-20 py-6 bg-gray-50">
      <section className="border rounded-md p-6 max-w-2xl mx-auto bg-white">
        <div>
          <h1 className="text-2xl font-bold">Add Your Trip</h1>
          <p className="text-sm text-gray-400">
            Plan your adventure with WanderWise!
          </p>
        </div>
        <section className="mt-6">
          <ItineraryForm
            mode="add"
            isLoading={false}
            onSubmit={(data) => {
              console.log(data);
            }}
            tripId={12345}
          />
        </section>
      </section>
    </main>
  );
};

export default AddItinerary;
