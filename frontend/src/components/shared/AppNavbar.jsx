//this is the component where we can use in any page
import React from "react";
import { Button } from "../ui/button";
import { NavLink } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

const AppNavbar = () => {
  const { logout } = useAuth();
  return (
    <header className="flex items-center justify-between py-2 px-8 border-b">
      <div className="flex items-center gap-4">
        <img src="/logo.png" alt="logo" className="h-10 w-10" />
        <h1 className="text-xl font-bold">WanderWise</h1>
      </div>

      <div className="flex gap-4">
        <nav className="flex items-center gap-4 [&>a]:hover:underline text-sm">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "text-primary font-semibold underline" : ""
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/trips"
            className={({ isActive }) =>
              isActive ? "text-primary font-semibold underline" : ""
            }
          >
            Trips
          </NavLink>
          <NavLink
            to="/itineraries"
            className={({ isActive }) =>
              isActive ? "text-primary font-semibold underline" : ""
            }
          >
            Itineraries
          </NavLink>

          <NavLink
            to="/packing"
            className={({ isActive }) =>
              isActive ? "text-primary font-semibold underline" : ""
            }
          >
            Packing List
          </NavLink>
        </nav>

        <div>
          <Button
            variant="outline"
            onClick={() => {
              logout();
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AppNavbar;
