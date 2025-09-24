import DashboardHero from "@/components/dashboardComponents/DashboardHero";
import TripStatusCards from "@/components/dashboardComponents/TripStatusCards";
import UserTrips from "@/components/dashboardComponents/UserTrips";
import { Button } from "@/components/ui/button";
import React from "react";

const Dashboard = () => {
  return (
    <main className="py-4 px-4 md:px-6 lg:px-20">
      <DashboardHero />
      <TripStatusCards />
      {/*   user trips */}

      <section className="my-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Trips</h1>
            <p className="text-sm text-gray-400 mb-6">
              Manage and explore your travel adventures with ease.
            </p>
          </div>
          <div>
            <a href="/trips">
              <Button variant="outline">Show All</Button>
            </a>
          </div>
        </div>

        <UserTrips />
      </section>
    </main>
  );
};

export default Dashboard;
