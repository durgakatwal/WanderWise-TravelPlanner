import React, { useState } from "react";
import api from "@/api/axios";
import Loading from "@/components/shared/Loading";
import { Button } from "@/components/ui/button";
import useApi from "@/hooks/useApi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  MapPin,
  Calendar,
  DollarSign,
  Users,
  FileText,
  Edit,
  Trash2,
  Download,
  Clock,
  Target,
  Plus,
  DollarSignIcon,
  PlusIcon,
  User,
  ExternalLink,
} from "lucide-react";
import InviteCollaborator from "@/components/trips/InviteCollaborator";
import AddFile from "@/components/trips/AddFile";

const TripInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dependancy, setDependancy] = useState(0);

  const {
    data: trip,
    error,
    loading,
  } = useApi(`/trips/${id}`, {}, [dependancy]);

  if (loading) return <Loading text="Loading trip details..." />;
  console.log(trip);

  const deleteTrip = async () => {
    try {
      await api.delete(`/trips/${id}`);
      toast.success("Trip deleted successfully!");
      navigate("/trips");
    } catch (err) {
      console.error(err);
      toast.error("Some error occurred");
    }
  };
  const deleteFile = async (publicId) => {
    const parts = publicId.split("/");
    const fileId = parts[parts.length - 1]; // get the actual ID

    try {
      const response = await api.delete(`/trips/${id}/files/${fileId}`);
      console.log(response);
      toast.success("File deleted successfully!");
      setDependancy(dependancy + 1);
    } catch (err) {
      console.error(err);
      toast.error("Some error occurred");
    }
  };

  const calculateDaysUntilTrip = () => {
    if (!trip) return 0;
    const today = new Date();
    const startDate = new Date(trip.startDate);
    const diffTime = startDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTripDuration = () => {
    if (!trip) return 0;
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    const diffTime = endDate.getTime() - startDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getBudgetProgress = () => {
    if (!trip?.budget) return 0;
    return (trip.budget.spent / trip.budget.total) * 100 || 0;
  };

  const getRemainingBudget = () => {
    if (!trip?.budget) return 0;
    return trip.budget.total - trip.budget.spent;
  };
  const checkImage = (url) => {
    const parts = url.split(".");
    const ext = parts[parts.length - 1];

    if (
      ["png", "jpg", "jpeg", "gif", "heif", "avif"].includes(ext.toLowerCase())
    ) {
      return true;
    } else {
      return false;
    }
  };
  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Trip Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "The requested trip could not be found."}
          </p>
          <a href="/dashboard">
            <Button>Back to Dashboard</Button>
          </a>
        </div>
      </div>
    );
  }

  // Safe defaults
  const destinations = trip.destinations || [];
  const expenses = trip.budget?.expenses || [];
  const collaborators = trip.collaborators || [];
  const files = trip.files || [];

  const daysUntilTrip = calculateDaysUntilTrip();
  const tripDuration = calculateTripDuration();
  const budgetProgress = getBudgetProgress();
  const remainingBudget = getRemainingBudget();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-20 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Trip Information */}
          <div className="lg:w-2/3">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                      {trip.title}
                    </CardTitle>
                    <CardDescription className="text-lg">
                      {trip.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-4">
                    <a href={`/trips/edit/${trip._id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Trip
                      </Button>
                    </a>
                    <Button variant="outline" size="sm" onClick={deleteTrip}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Trip Status */}
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-semibold text-blue-900">
                        {daysUntilTrip > 0
                          ? `${daysUntilTrip} days until departure`
                          : daysUntilTrip === 0
                          ? "Departing today!"
                          : "Trip in progress"}
                      </p>
                      <p className="text-sm text-blue-700">
                        {tripDuration} day trip
                      </p>
                    </div>
                  </div>
                  <Badge variant={daysUntilTrip > 0 ? "secondary" : "default"}>
                    {daysUntilTrip > 0
                      ? "Upcoming"
                      : daysUntilTrip === 0
                      ? "Today"
                      : "Active"}
                  </Badge>
                </div>

                {/* Dates */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <Calendar className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-semibold">Start Date</p>
                      <p className="text-gray-600">
                        {new Date(trip.startDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <Calendar className="h-6 w-6 text-red-600" />
                    <div>
                      <p className="font-semibold">End Date</p>
                      <p className="text-gray-600">
                        {new Date(trip.endDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Destinations */}
                {destinations.length > 0 && (
                  <div className="border-b-2 pb-8">
                    <div className="flex items-center space-x-2 mb-3">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">Destinations</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {destinations.map((destination, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="px-3 py-1"
                        >
                          {destination}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Budget Overview */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold">Budget Overview</h3>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Budget</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${trip.budget?.total || 0}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <p className="text-sm text-gray-600">Spent</p>
                      <p className="text-2xl font-bold text-red-600">
                        ${trip.budget?.spent || 0}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">Remaining</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${remainingBudget}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Budget Progress</span>
                      <span>{budgetProgress.toFixed(1)}%</span>
                    </div>
                    <Progress value={budgetProgress} className="h-2" />
                  </div>
                </div>

                {/* Recent Expenses */}
                {expenses.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Recent Expenses</h4>
                    <div className="space-y-2">
                      {expenses.slice(0, 3).map((expense, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{expense.name}</p>
                          </div>
                          <p className="font-semibold">${expense.amount}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Collaborators */}
                {collaborators.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Users className="h-5 w-5 text-purple-600" />
                      <h3 className="text-lg font-semibold">Collaborators</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      {collaborators.map((member, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-4 p-2 bg-gray-50 rounded-lg"
                        >
                          <div className="p-2 bg-amber-400 rounded-full">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm">{member.name}</p>
                            <span className="text-sm text-gray-400">
                              {member.email}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Files */}
                {/* Files Section */}
                {files.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <FileText className="h-5 w-5 text-orange-600" />
                      <h3 className="text-lg font-semibold">
                        Files & Documents
                      </h3>
                    </div>

                    {/* Scrollable container */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-2 border rounded-lg">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="relative group border rounded-lg p-1"
                        >
                          {checkImage(file.url) ? (
                            <img
                              src={file.url}
                              alt={file._id}
                              className="w-full h-48 object-cover rounded-md"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-48 bg-gray-100 rounded-md">
                              <FileText className="h-10 w-10 text-gray-400" />
                            </div>
                          )}
                          {/* Overlay buttons */}
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                            <Button
                              variant="icon"
                              size="sm"
                              className="text-red-600 hover:text-white hover:bg-red-500"
                              onClick={() => deleteFile(file._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            {!checkImage(file.url) && (
                              <a href={file.url} target="_blank">
                                <Button
                                  variant="icon"
                                  size="sm"
                                  className="ml-1"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Action Cards */}
          <div className="lg:w-1/3 space-y-4">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
                <CardDescription>Manage your trip details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <a href={`/itineraries?tripId=${trip._id}`} className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    View Itinerary
                  </Button>
                </a>
                <a href={`/packing?tripId=${trip._id}`} className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    <Target className="mr-2 h-4 w-4" />
                    Packing List
                  </Button>
                </a>
              </CardContent>
            </Card>

            {/*  Expenses Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Expenses</CardTitle>
                <CardDescription>Add new expense to this trip</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const name = e.target.name.value;
                    const amount = parseFloat(e.target.amount.value);

                    try {
                      const res = await api.post(
                        `/trips/${trip._id}/expenses`,
                        {
                          tripId: trip._id,
                          name,
                          amount,
                        }
                      );
                      toast.success("Expense added!");
                      setDependancy(dependancy + 1); //this dependency helps to automatically update the page without refreshing
                      e.target.reset();
                    } catch (err) {
                      console.error("Add expense failed:", err);
                      toast.error("Failed to add expense");
                    }
                  }}
                  className="space-y-3"
                >
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Expense Name"
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      name="amount"
                      placeholder="Amount"
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <PlusIcon /> Add Expense
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* invite collaborator  */}
            <InviteCollaborator tripId={id} />

            <AddFile
              tripId={id}
              dependancy={dependancy}
              setDependancy={setDependancy}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripInfo;
