import { ItineraryForm } from "@/components/itineraryComponents/ItineraryForm";
import Loading from "@/components/shared/Loading";
import useApi from "@/hooks/useApi";
import React from "react";
import { useParams, useSearchParams } from "react-router-dom";

const EditItinerary = () => {
  const { id } = useParams();

  const [searchParams, setSearchParams] = useSearchParams();
  const tripId = searchParams.get("tripId");

  const {
    data: itinerary,
    loading,
    error,
  } = useApi(`/itineraries/${tripId}/${id}`);

  const newItinerary = {
    ...itinerary,
    // date: itinerary?.date ? itinerary.date.split("T")[0] : "",
    date: itinerary?.date?.split("T")[0],
  };

  if (loading) return <Loading />;

  return (
    <main className="px-20 py-6 bg-gray-50">
      <section className="border rounded-md p-6 max-w-2xl mx-auto bg-white">
        <div>
          <h1 className="text-2xl font-bold">Edit Itineraries</h1>
          <p className="text-sm text-gray-400">
            Plan your adventure with WanderWise!
          </p>
        </div>
        <section className="mt-6">
          <ItineraryForm initialData={newItinerary} />
        </section>
      </section>
    </main>
  );
};

export default EditItinerary;
