// src/pages/Login.jsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

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
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { loginUser } from "@/api/auth"; // ← Your API function
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

// 🔐 Zod Schema for Login
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export default function Login() {
  const { login } = useAuth(); // ← From AuthContext
  const navigate = useNavigate();
  const [error, setError] = useState(""); // For login errors (e.g., invalid credentials)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { token } = useAuth(); //if there is token still in the local storage then (to check the token available or not)
  if (token) {
    navigate("/dashboard");
  }

  //  Handle Form Submit
  // const onSubmit = async (data) => {
  //   try {
  //     setError(""); // Clear previous errors

  //     // Step 1: Call backend to login
  //     const response = await loginUser(data); // This returns { token, user }
  //     const { token, user } = response;

  //     //  Step 2: Update global auth state
  //     login(user, token);

  //     //  Step 3: Redirect to dashboard
  //     navigate("/dashboard");
  //   } catch (err) {
  //     //  Show user-friendly error
  //     setError(err.response?.data?.message || "Invalid email or password.");
  //     console.error("Login failed:", err);
  //   }
  // };

  async function onSubmit(data) {
    const { email, password } = data;
    try {
      const response = await loginUser({ email, password });

      // TODO: when user is logged in, return user data along with token from backend
      if (response.token) {
        login({ email }, response.token);
        navigate("/dashboard");
      } else {
        alert(response.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Side - Image Section (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="/vite.svg" // Replace with real image later
          alt="Login Banner"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 opacity-70"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-start pl-20 text-white">
          <h1 className="text-5xl font-bold">Welcome Back</h1>
          <p className="mt-4 text-lg max-w-md">
            Log in to continue your journey with us. Explore, connect, and grow.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center w-full lg:w-1/2 p-6 sm:p-8">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8 space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold">Log In</h2>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          {/* OAuth Buttons */}
          <div className="flex flex-col space-y-3 mt-4">
            <Button
              variant="outline"
              className="flex items-center justify-center gap-3 py-2"
              type="button"
            >
              <FcGoogle className="w-5 h-5" />
              Login with Google
            </Button>

            <Button
              variant="outline"
              className="flex items-center justify-center gap-3 py-2"
              type="button"
            >
              <FaGithub className="w-5 h-5" />
              Login with GitHub
            </Button>
          </div>

          {/* Separator */}
          <div className="flex items-center my-4">
            <Separator className="flex-grow" />
            <span className="px-4 text-sm text-gray-500">or</span>
            <Separator className="flex-grow" />
          </div>

          {/* Login Form */}
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
                      <a
                        href="/forgot-password"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Forgot your password?
                      </a>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Error Message */}
              {error && (
                <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button type="submit" className="w-full mt-2">
                Log In
              </Button>
            </form>
          </Form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
