// src/components/Navbar.jsx
import React from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between py-2 px-8 border-b">
      <div className="flex items-center gap-4">
        <img src="/logo.png" alt="logo" className="h-10 w-10" />
        <h1 className="text-xl font-bold">WanderWise</h1>
      </div>

      <div className="flex gap-4">
        <nav className="flex items-center gap-4 [&>a]:hover:underline text-sm">
          <a href="#features">Features</a>
          <a href="#trips">Trips</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#about">About</a>
        </nav>

        <div>
          <Button onClick={handleLoginClick}>Login</Button>{" "}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
