import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPin, CheckSquare, Plus, Trash2, Package, Edit } from "lucide-react";
import api from "@/api/axios";
import useApi from "@/hooks/useApi";
import Loading from "../shared/Loading";
import { toast } from "sonner";

const PackingList = ({ selectedTripId }) => {
  console.log("selectedTripId:", selectedTripId);
  const [dependancy, setDependancy] = useState(0);

  const {
    loading,
    error,
    data: packingItems,
  } = useApi(`/package-lists/${selectedTripId}`, {}, [dependancy]);

  //dialog box close or open
  const [isAddingItem, setIsAddingItem] = useState(false);

  //dialog box opened for editing
  const [isEditing, setIsEditing] = useState(false);

  //store item info ,if selected for editing
  const [selectedItem, setSelectedItem] = useState(null);

  const [newItemName, setNewItemName] = useState("");

  const addPackingItem = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await api.post(`/package-lists/${selectedTripId}`, {
        name: newItemName,
        user: userId,
      });

      if (response.data?._id) {
        toast.success("Packing Item added!");
        setDependancy(dependancy + 1);
      } else {
        toast.error("Failed to add item");
      }
    } catch (error) {
      console.log("Some error occured");
      toast.error("Some error occured! Try again later.");
    }
    setIsAddingItem(false);
    setNewItemName("");
  };

  const deleteItem = async (id) => {
    try {
      const response = await api.delete(
        `/package-lists/${selectedTripId}/${id}`
      );
      if (response.data.message) {
        toast.success("Item deleted successfully");
        setDependancy(dependancy + 1);
      }
    } catch (error) {
      console.log("Some error occured", error);
      toast.error("Some error occured");
    }
  };

  const editPackingItem = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await api.patch(
        `/package-lists/${selectedTripId}/${selectedItem._id}`,
        { name: newItemName, user: userId }
      );

      if (response.data?._id) {
        toast.success("Packing Item edited!");
        setDependancy(dependancy + 1);
      } else {
        toast.error("Failed to edit item");
      }
    } catch (error) {
      console.log("Some error occured", error);
      toast.error("Some error occured! Try again later.");
    }
    setIsAddingItem(false);
    setNewItemName("");
  };

  const toggleCompleted = async (id, completedValue) => {
    try {
      const response = await api.patch(
        `/package-lists/${selectedTripId}/${id}`,
        { completed: completedValue }
      );

      if (response.data?._id) {
        toast.success("Item packed!");
        setDependancy(dependancy + 1);
      } else {
        toast.error("Failed to update status!!");
      }
    } catch (error) {
      console.log("Some error occured", error);
      toast.error("Some error occured! Try again later.");
    }
  };

  const getDateDisplay = (dateString) => {
    if (!dateString) return "No date";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Trip Info & Progress */}

      {/* Add Item Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Packing Items</h2>
        <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {" "}
                {isEditing ? "Edit" : "Add"} Packing Item
              </DialogTitle>
              <DialogDescription>
                {" "}
                {isEditing ? "Edit" : "Add"} a new item to your packing list
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="item-name">Item Name</Label>
                <Input
                  id="item-name"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Enter item name (e.g., T-shirts (3), Passport, etc.)"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingItem(false);
                    setNewItemName("");
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={isEditing ? editPackingItem : addPackingItem}>
                  {isEditing ? "Edit" : "Add"} Item
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Packing Items */}
      <div className="space-y-4">
        {packingItems.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No items found
              </h3>
              <p className="text-gray-600 mb-4">
                Start adding items to your packing list
              </p>
              <Button onClick={() => setIsAddingItem(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Item
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {packingItems.map((item) => (
              <Card
                key={item._id}
                className={`transition-all px-6  ${
                  item.completed ? "bg-green-50 border-green-200" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  {/* left  */}
                  <div className="flex items-center gap-4">
                    <Checkbox
                      className=" h-6 w-6 shadow-md"
                      checked={item.completed}
                      onClick={() => {
                        toggleCompleted(item._id, !item.completed);
                      }}
                    />
                    <p className="text-lg font-semibold">{item.name}</p>
                  </div>

                  {/* right */}
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={() => {
                        setIsAddingItem(true);
                        setNewItemName(item.name);
                        setIsEditing(true);
                        setSelectedItem(item);
                      }}
                      variant="outline"
                      size="icon"
                    >
                      <Edit />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        deleteItem(item._id);
                      }}
                    >
                      <Trash2 className="text-red-500" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PackingList;
