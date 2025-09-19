import { useState } from "react";
import { testimonials } from "@/lib/constants";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 3 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= testimonials.length - 3 ? 0 : prev + 1));
  };

  return (
    <section className="py-12 bg-gray-50" id="testimonials">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-orange-500">TESTIMONIALS</h2>
        <p className="text-gray-600 mt-2">
          Hear what our travelers say about us
        </p>

        <div className="relative mt-8 flex items-center">
          {/* Left Arrow */}

          <Button
            onClick={handlePrev}
            className="absolute -left-10 bg-white p-2 rounded-full shadow hover:bg-orange-100 transition"
          >
            <ChevronLeft className="h-6 w-6 text-orange-500" />
          </Button>

          {/* Sliding Wrapper */}
          <div className="overflow-hidden w-full">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / 3)}%)`,
              }}
            >
              {testimonials.map((t, index) => (
                <div key={index} className="w-1/3 flex-shrink-0 px-2">
                  <Card className="text-center shadow-md hover:shadow-lg transition h-full">
                    <CardHeader>
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                      />
                      <CardTitle className="text-xl">{t.name}</CardTitle>
                      <p className="text-sm text-gray-500">{t.location}</p>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{t.feedback}</CardDescription>
                      <div className="flex justify-center mb-3">
                        {Array.from({ length: t.rating }, (_, i) => (
                          <t.icon key={i} className="text-yellow-500 mt-2 " />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <Button
            onClick={handleNext}
            className="absolute -right-10 bg-white p-2 rounded-full shadow hover:bg-orange-100 transition"
          >
            <ChevronRight className="h-6 w-6 text-orange-500" />
          </Button>
        </div>
      </div>
    </section>
  );
}
