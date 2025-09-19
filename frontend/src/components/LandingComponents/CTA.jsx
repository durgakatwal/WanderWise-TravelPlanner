import React from "react";
import { Button } from "../ui/button";

const CTA = () => {
  return (
    <section className="py-24 bg-primary/80 text-white" id="about">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Start Your Journey?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of travelers who trust Wander Wise for their adventures
        </p>
        <a href="/signup">
          <Button
            size="lg"
            className="bg-white font-medium text-primary hover:bg-gray-200"
          >
            Get Started Today
          </Button>
        </a>
      </div>
    </section>
  );
};

export default CTA;
