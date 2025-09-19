import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { registerUser } from "@/api/auth";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

// Define preferences as a plain array
const PREFERENCES = [
  "budget-travel",
  "adventure",
  "luxury",
  "solo-travel",
  "family-friendly",
  "eco-friendly",
  "food-tourism",
  "cultural-exploration",
];

// Zod schema
const formSchema = z
  .object({
    email: z.string().email({ message: "Please enter a valid email." }),
    name: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Please confirm your password.",
    }),
    bio: z.string().max(500).optional().default(""),
    avatar: z
      .string()
      .url({ message: "Must be a valid URL" })
      .optional()
      .default(""),
    preferences: z.array(z.enum(PREFERENCES)).optional().default([]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function SignUp() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      bio: "",
      avatar: "",
      preferences: [],
    },
  });
  const { token } = useAuth(); //if there is token still in the local storage then (to check the token available or not)
  if (token) {
    navigate("/dashboard");
  }
  const onSubmit = (data) => {
    const { name, email, password, bio, avatar, preferences } = data;
    try {
      const { token } = registerUser({
        name,
        email,
        password,
        bio,
        avatar,
        preferences,
      });
      login({ name, email, password, bio, avatar, preferences }, token);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert("SignUp failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Side - Image Section (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="/vite.svg" // Replace with your actual image URL
          alt="Sign Up Banner"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 opacity-70"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-start pl-20 text-white">
          <h1 className="text-5xl font-bold">Join Us Today</h1>
          <p className="mt-4 text-lg max-w-md">
            Create an account to get started with our platform. Connect, share,
            and grow.
          </p>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="flex items-center justify-center w-full lg:w-1/2 p-6 sm:p-8">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8 space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold">Create an Account</h2>
            <p className="text-gray-600 mt-2">
              Fill in your details to get started
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="flex flex-col space-y-3 mt-4">
            <Button
              variant="outline"
              className="flex items-center justify-center gap-3 py-2"
              type="button"
            >
              <FcGoogle className="w-5 h-5" />
              Sign up with Google
            </Button>

            <Button
              variant="outline"
              className="flex items-center justify-center gap-3 py-2"
              type="button"
            >
              <FaGithub className="w-5 h-5" />
              Sign up with GitHub
            </Button>
          </div>

          {/* Separator */}
          <div className="flex items-center my-4">
            <Separator className="flex-grow" />
            <span className="px-4 text-sm text-gray-500">or</span>
            <Separator className="flex-grow" />
          </div>

          {/* Sign Up Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Username */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>name</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe" {...field} />
                    </FormControl>
                    <FormDescription>
                      This will be your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Must be at least 8 characters.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bio */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about yourself..."
                        {...field}
                        className="resize-none"
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription>Max 500 characters.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Avatar URL */}
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Picture URL</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://example.com/avatar.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional: Enter a URL to your profile picture.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Preferences */}
              <FormField
                control={form.control}
                name="preferences"
                render={() => (
                  <FormItem>
                    <FormLabel>Travel Preferences</FormLabel>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {PREFERENCES.map((item) => (
                        <FormField
                          key={item}
                          control={form.control}
                          name="preferences"
                          render={({ field }) => (
                            <FormItem
                              key={item}
                              className="flex flex-row items-center space-x-2 space-y-0"
                            >
                              <FormControl>
                                <input
                                  type="checkbox"
                                  checked={field.value?.includes(item)}
                                  onChange={(e) => {
                                    const current = field.value || [];
                                    const newValue = e.target.checked
                                      ? [...current, item]
                                      : current.filter((v) => v !== item);
                                    field.onChange(newValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal capitalize text-sm">
                                {item.replace("-", " ")}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormDescription>
                      Select your travel interests.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button type="submit" className="w-full mt-2">
                Sign Up
              </Button>
            </form>
          </Form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
