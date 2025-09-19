// // src/components/AboutUs.jsx
// import React from "react";
// import { Card, CardContent } from "@/components/ui/card";

// const AboutUs = () => {
//   return (
//     <section className="py-16 bg-white" id="about">
//       <div className="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
//         {/* Left side - Image */}
//         <div className="w-full lg:w-1/2">
//           <img
//             src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
//             alt="About Us - Travel"
//             className="rounded-2xl shadow-md w-full h-[350px] object-cover"
//           />
//         </div>

//         {/* Right side - Content */}
//         <div className="w-full lg:w-1/2 text-center lg:text-left">
//           <h2 className="text-3xl font-bold text-orange-500 mb-4">About Us</h2>
//           <p className="text-gray-600 mb-6 leading-relaxed">
//             At <span className="font-semibold text-orange-500">WonderWise</span>
//             , we believe that travel is more than just visiting places—it’s
//             about creating stories, making memories, and connecting with people.
//           </p>
//           <Card className="shadow-md border-none">
//             <CardContent className="p-6">
//               <p className="text-gray-700">
//                 Whether you're a solo explorer, a family traveler, or a group of
//                 adventurers, our platform helps you plan, collaborate, and share
//                 your journey seamlessly.
//               </p>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default AboutUs;

import React from "react";
import { Button } from "../ui/button";

const About = () => {
  return (
    <section
      className="relative flex items-center justify-center text-white"
      id="about"
    >
      <div className="absolute top-0 left-0 w-full h-full -z-20">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          src="/travel2.mp4"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute h-full w-full top-0 left-0 bg-black/50 -z-10"></div>
      <div className="flex flex-col items-center justify-center text-center gap-6 min-h-[80vh] max-w-2/3 px-4">
        <h2 className="text-4xl md:text-6xl font-bold">About Us</h2>
        <p className="text-sm text-white">
          At <span className="font-semibold text-orange-500">WonderWise</span>,
          we believe that travel is more than just visiting places—it’s about
          creating stories, making memories, and connecting with people.
          <br />
          Whether you're a solo explorer, a family traveler, or a group of
          adventurers, our platform helps you plan, collaborate, and share your
          journey seamlessly. Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Debitis provident ipsum ipsam, sequi optio sint, iusto veritatis
          pariatur cupiditate cumque quasi earum! Eius ad quidem saepe aut
          consectetur culpa reiciendis?
        </p>
        <Button>Explore</Button>
      </div>
    </section>
  );
};

export default About;
