import Team from "@/components/LandingComponents/Team";
import FamousTrips from "@/components/LandingComponents/FamousTrips";
import Features from "@/components/LandingComponents/Features";
import Hero from "@/components/LandingComponents/Hero";
import Navbar from "@/components/LandingComponents/Navbar";
import Testimonial from "@/components/LandingComponents/Testimonials";
import React, { useEffect } from "react";
import AboutUs from "@/components/LandingComponents/About";
import Footer from "@/components/LandingComponents/Footer";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import CTA from "@/components/LandingComponents/CTA";

const LandingPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth(); //if there is token still in the local storage then (to check the token available or not)

  useEffect(() => {
    if (token) {
      console.log("navigating to dashboard");
      navigate("/dashboard");
    }
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <FamousTrips />
      <Testimonial />
      <AboutUs />
      <Team />
      <CTA />
      <Footer />
    </>
  );
};

export default LandingPage;
