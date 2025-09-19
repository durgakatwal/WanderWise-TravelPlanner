import { teamMembers } from "@/lib/constants";
import React from "react";

const Team = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-orange-500 mb-4">
          Meet Our Team
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          We are a passionate team of developers, designers, and dreamers
          building{" "}
          <span className="font-semibold text-orange-500">WonderWise</span> to
          make travel planning easy, fun, and collaborative.
        </p>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 mx-auto rounded-full object-cover mb-4 border-4 border-orange-100"
              />
              <h3 className="text-lg font-semibold text-gray-800">
                {member.name}
              </h3>
              <p className="text-gray-500 text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
