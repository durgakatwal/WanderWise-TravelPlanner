import React from "react";
import { Button } from "../ui/button";
import { NavLink } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { LucideMenu, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const AppNavbar = () => {
  const { user, logout } = useAuth();
  return (
    <header className="flex items-center justify-between py-4 px-4 md:px-8 border-b">
      <div className="flex items-center gap-4">
        <img src="/logo.png" alt="logo" className="h-10 w-10" />
        <h1 className="text-2xl font-bold">Wander Wise</h1>
      </div>

      <div className=" gap-10 hidden md:flex">
        <nav className="flex items-center gap-8 [&>a]:hover:underline font-medium text-gray-800">
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
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>
            <div className="px-6">
              <nav className="flex flex-col gap-6 [&>a]:hover:underline font-medium text-gray-800  [&>a]:bg-gray-50 [&>a]:p-2">
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    isActive ? "text-primary font-semibold underline" : ""
                  }
                >
                  Profile
                </NavLink>
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
                  variant="destructive"
                  className="mt-8 w-full"
                  onClick={logout}
                >
                  Logout
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default AppNavbar;
