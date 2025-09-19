import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Plus, Box } from "lucide-react";
import useApi from "@/hooks/useApi";
import Loading from "@/components/shared/Loading";
import PackingList from "@/components/packingComponent/PackingList";
import { useSearchParams } from "react-router-dom";

export default function PackingPage() {
  const { data: trips, error, loading } = useApi("/trips");

  const [selectedTripId, setSelectedTripId] = useState("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tripId = searchParams.get("tripId");
    if (tripId) {
      setSelectedTripId(tripId);
    }
  }, [searchParams]);
  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="container mx-auto px-20 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Packing Lists
          </h1>
          <p className="text-gray-600">
            Organize and track your travel essentials
          </p>
        </div>

        {/* Trip Selection */}
        <div className="mb-8">
          <Label
            htmlFor="trip-select"
            className="text-sm font-medium mb-2 block"
          >
            Select Trip
          </Label>

          <Select
            value={selectedTripId}
            onValueChange={(value) => {
              setSelectedTripId(value);
            }}
          >
            <SelectTrigger id="trip-select" className="w-full max-w-md">
              <SelectValue placeholder="Select a trip" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value={null}>Select a trip</SelectItem>
              {trips.map((trip) => (
                <SelectItem key={trip._id} value={trip._id}>
                  {trip.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedTripId ? (
          <PackingList selectedTripId={selectedTripId} />
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Box className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No trip selected
              </h3>
              <p className="text-gray-600 mb-4">
                Select a trip to view and manage its packing list
              </p>
              <a href="/trips/add">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Plan Your First Trip
                </Button>
              </a>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
