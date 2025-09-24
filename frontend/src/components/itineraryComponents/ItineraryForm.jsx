import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Plus,
  Trash2,
  Clock,
  X,
  StickyNote,
} from "lucide-react";
import api from "@/api/axios";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";

const activitySchema = z.object({
  name: z.string().min(1, "Activity name is required"),
  time: z.string().min(1, "Time is required"),
  notes: z.array(z.string()).default([]),
});

const itinerarySchema = z.object({
  title: z.string().min(1, "Itinerary title is required"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  activities: z
    .array(activitySchema)
    .min(1, "At least one activity is required"),
});

export function ItineraryForm({ initialData }) {
  console.log("initial data :", initialData);
  const [searchParams, setSearchParams] = useSearchParams();
  const tripId = searchParams.get("tripId");
  const selectedDate = searchParams.get("date");

  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(itinerarySchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      date: selectedDate || new Date().toISOString().split("T")[0],
      activities: [
        {
          name: "",
          time: "09:00",
          notes: [],
        },
      ],
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await api.post(`/itineraries/${tripId}`, data);
      console.log(response);
      if (response.data._id) {
        toast.success("Itinerary created successfully!");
        // navigate(`/itineraries/${response.data._id}`);  here this redirect to the itineraries/id page which is not required we can navigate directly to only itinerary page
        navigate(`/itineraries`);
      } else {
        toast.error("Failed to create itinerary");
      }
    } catch (error) {
      console.error("Error creating trip:", error);
      toast.error("An error occurred while creating the itinerary");
    }
  };

  const editItinerary = async (data) => {
    try {
      const response = await api.patch(
        `/itineraries/${tripId}/${initialData._id}`,
        data
      );
      if (response.data._id) {
        toast.success("Itinerary updated successfully!");
        navigate(`/itineraries`);
      } else {
        toast.error("Failed to update itinerary");
        console.log(response);
      }
    } catch (error) {
      console.error("Error creating trip:", error);
      toast.error("An error occurred while updating the itinerary");
    }
  };

  const {
    fields: activityFields,
    append: appendActivity,
    remove: removeActivity,
  } = useFieldArray({
    control: form.control,
    name: "activities",
  });

  const addActivity = () => {
    appendActivity({
      name: "",
      time: "09:00",
      notes: [],
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(initialData ? editItinerary : onSubmit)}
          className="space-y-6"
        >
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                Itinerary Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Itinerary Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Day 1 - Exploring Paris"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Give this day a memorable title
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the day's theme or goals..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Add any additional details about this day
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" readOnly={selectedDate} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-green-600" />
                  Daily Activities
                </div>
                <Button
                  type="button"
                  onClick={addActivity}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Activity
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {activityFields.map((field, activityIndex) => (
                <ActivityCard
                  key={field.id}
                  activityIndex={activityIndex}
                  form={form}
                  onRemove={() => removeActivity(activityIndex)}
                  canRemove={activityFields.length > 1}
                />
              ))}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" size="lg">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

// Separate component for activity card to properly handle nested useFieldArray
function ActivityCard({ activityIndex, form, onRemove, canRemove }) {
  const {
    fields: noteFields,
    append: appendNote,
    remove: removeNote,
  } = useFieldArray({
    control: form.control,
    name: `activities.${activityIndex}.notes`,
  });

  const addNote = () => {
    appendNote("");
  };

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
      <div className="flex items-center justify-between">
        <Badge variant="outline">Activity {activityIndex + 1}</Badge>
        {canRemove && (
          <Button
            type="button"
            onClick={onRemove}
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-700 bg-transparent"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name={`activities.${activityIndex}.name`}
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Activity Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Visit Eiffel Tower" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`activities.${activityIndex}.time`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Time
              </FormLabel>
              <FormControl>
                <Input placeholder="9 AM Morning" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Notes Section with nested useFieldArray */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <FormLabel className="flex items-center text-sm font-medium">
            <StickyNote className="mr-2 h-4 w-4" />
            Notes
          </FormLabel>
          <Button type="button" onClick={addNote} size="sm" variant="outline">
            <Plus className="h-3 w-3 mr-1" />
            Add Note
          </Button>
        </div>
        <div className="space-y-2">
          {noteFields.map((noteField, noteIndex) => (
            <div key={noteField.id} className="flex gap-2 items-center">
              <FormField
                control={form.control}
                name={`activities.${activityIndex}.notes.${noteIndex}`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Add a note..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                onClick={() => removeNote(noteIndex)}
                size="icon"
                variant="outline"
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          {noteFields.length === 0 && (
            <p className="text-sm text-gray-500 italic">
              No notes yet. Click "Add Note" to add one.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
