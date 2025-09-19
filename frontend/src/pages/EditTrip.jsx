import Loading from "@/components/shared/Loading";
import { TripForm } from "@/components/trips/TripForm";

import useApi from "@/hooks/useApi";
import React from "react";
import { useParams } from "react-router-dom";

const EditTrip = () => {
  const { id } = useParams();

  const { data, loading, error } = useApi(`/trips/${id}`);

  if (loading) return <Loading />;

  const newData = {
    ...data,
    _id: data._id,
    startDate: data.startDate.split("T")[0],
    endDate: data.endDate.split("T")[0],
    accommodation: {
      ...data.accommodation,
      checkIn: data.accommodation?.checkIn
        ? data.accommodation.checkIn.split("T")[0]
        : "",
      checkOut: data.accommodation?.checkOut
        ? data.accommodation.checkOut.split("T")[0]
        : "",
    },
  };

  return (
    <main className="px-20 py-6 bg-gray-50">
      <section className="border rounded-md p-6 max-w-2xl mx-auto bg-white">
        <div>
          <h1 className="text-2xl font-bold">Edit This Trip</h1>
          <p className="text-sm text-gray-400">
            Plan your next adventure with WanderWise!
          </p>
        </div>
        <section className="mt-6">
          <TripForm initialData={newData} />
        </section>
      </section>
    </main>
  );
};

export default EditTrip;
