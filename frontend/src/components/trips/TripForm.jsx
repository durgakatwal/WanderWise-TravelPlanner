// src/pages/TripForm.jsx
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Calendar,
  MapPin,
  DollarSign,
  Plus,
  Trash2,
  Plane,
  Receipt,
  Bed,
  ClipboardList,
} from "lucide-react";
import api from "@/api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

//  Zod validation schemas
const expenseSchema = z.object({
  name: z.string().min(1, "Expense name is required"),
  amount: z.number().min(0, "Amount must be 0 or greater"),
});

const budgetSchema = z.object({
  total: z.number().min(0, "Total budget must be 0 or greater"),
  spent: z.number().default(0),
  expenses: z.array(expenseSchema).optional(),
});

const tripInfoSchema = z
  .object({
    title: z.string().min(1, "Trip title is required"),
    description: z.string().optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    destination: z
      .array(z.string().min(1, "Destination cannot be empty"))
      .min(1, "At least one destination is required"),
    budget: budgetSchema,
    transport: z.object({
      mode: z.string().optional(),
      details: z.string().optional(),
    }),
    accommodation: z.object({
      name: z.string().optional(),
      address: z.string().optional(),
      checkIn: z.string().optional(),
      checkOut: z.string().optional(),
    }),
    notes: z.string().optional(),
    status: z
      .enum(["Draft", "Planned", "Ongoing", "Completed"])
      .default("Draft"),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export function TripForm({ initialData }) {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(tripInfoSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      destination: [""],
      budget: { total: "", spent: 0, expenses: [] },
      transport: { mode: "", details: "" },
      accommodation: { name: "", address: "", checkIn: "", checkOut: "" },
      notes: "",
      status: "Draft",
    },
  });

  //  For multiple destinations
  const {
    fields: destinationFields,
    append: appendDestination,
    remove: removeDestination,
  } = useFieldArray({ control: form.control, name: "destination" });

  //  For budget expenses
  const {
    fields: expenseFields,
    append: appendExpense,
    remove: removeExpense,
  } = useFieldArray({ control: form.control, name: "budget.expenses" });

  const onSubmit = async (data) => {
    try {
      const response = await api.post("/trips", data);
      if (response.data._id) {
        toast.success("Trip created successfully!");
        navigate(`/trips/${response.data._id}`);
      } else {
        toast.error("Failed to create trip");
      }
    } catch (error) {
      console.error("Error creating trip:", error);
      toast.error("An error occurred while creating the trip");
    }
  };

  const onEdit = async (data) => {
    console.log(data);
    try {
      const response = await api.put(`/trips/${initialData._id}`, data);
      console.log(response);
      if (response.data._id) {
        toast.success("Trip updated successfully!");
        navigate(`/trips/${response.data._id}`);
      } else {
        toast.error("Failed to update trip");
      }
    } catch (error) {
      console.error("Error updating trip:", error);
      toast.error("An error occurred while updating the trip");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={
          initialData ? form.handleSubmit(onEdit) : form.handleSubmit(onSubmit)
        }
        className="space-y-8"
      >
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plane className="mr-2 h-5 w-5 text-blue-600" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trip Title</FormLabel>
                  <FormControl>
                    <Input placeholder="European Adventure 2025" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Trip details..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Destinations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-green-600" />
                Destinations
              </span>
              <Button
                type="button"
                onClick={() => appendDestination("")}
                size="sm"
                variant="outline"
              >
                <Plus className="mr-2 h-4 w-4" /> Add
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {destinationFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name={`destination.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder={`Destination ${index + 1}`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {destinationFields.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeDestination(index)}
                    size="sm"
                    variant="outline"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Budget */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-purple-600" />
              Budget Planning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="budget.total"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Budget</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Expenses</h3>
                <Button
                  type="button"
                  onClick={() => appendExpense({ name: "", amount: 0 })}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add
                </Button>
              </div>
              {expenseFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`budget.expenses.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="Expense name" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`budget.expenses.${index}.amount`}
                    render={({ field }) => (
                      <FormItem className="w-32">
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    onClick={() => removeExpense(index)}
                    size="sm"
                    variant="outline"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transport */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Receipt className="mr-2 h-5 w-5 text-indigo-600" />
              Transport
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="transport.mode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mode</FormLabel>
                  <FormControl>
                    <Input placeholder="Flight / Train / Car" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transport.details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Details</FormLabel>
                  <FormControl>
                    <Input placeholder="Flight number, timings..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Accommodation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bed className="mr-2 h-5 w-5 text-pink-600" />
              Accommodation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="accommodation.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Hotel Name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accommodation.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Hotel Address" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="accommodation.checkIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check In</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accommodation.checkOut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check Out</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notes & Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ClipboardList className="mr-2 h-5 w-5 text-gray-600" />
              Notes & Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Extra info..." rows={3} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <select {...field} className="border p-2 rounded w-full">
                      <option value="Draft">Draft</option>
                      <option value="Planned">Planned</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg">
            Submit
          </Button>
          <Button
            type="button"
            size="lg"
            onClick={() =>
              form.reset(
                initialData || {
                  title: "",
                  description: "",
                  startDate: "",
                  endDate: "",
                  destination: [""],
                  budget: { total: "", spent: 0, expenses: [] },
                  transport: { mode: "", details: "" },
                  accommodation: {
                    name: "",
                    address: "",
                    checkIn: "",
                    checkOut: "",
                  },
                  notes: "",
                  status: "Draft",
                }
              )
            }
          >
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}
