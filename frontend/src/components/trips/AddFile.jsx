import React from "react";
import { FileUp, Plus, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import api from "@/api/axios";
import { toast } from "sonner";
import { useState } from "react";
import Loading from "../shared/Loading";

const fileSchema = z.object({
  // file: z.file().min(1, "File is required"),
  file: z.any().refine((file) => file?.length > 0, "File is required"),
});

const AddFile = ({ tripId, dependancy, setDependancy }) => {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      file: null,
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    // console.log(data);
    try {
      const formData = new FormData();
      for (let i = 0; i < data.file.length; i++) {
        formData.append("files", data.file[i]);
      }

      const response = await api.post(`/trips/${tripId}/files`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // console.log(response.data._id);
      if (response.data._id) {
        console.log("showing toast");
        toast.success("File uploaded successfully!");
        setDependancy(dependancy + 1);
      } else {
        toast.error("Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("An error occurred while uploading file");
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <Loading text="Uploading file..." />;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <FileUp className="mr-2 h-5 w-5 text-blue-600" />
              Upload Files
            </CardTitle>
            <CardDescription>Upload your memories of the trip.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      onChange={(e) => field.onChange(e.target.files)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default AddFile;
