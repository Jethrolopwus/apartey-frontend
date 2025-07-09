"use client";

import React, { useState } from "react";
import StepPropertyType from "@/components/molecules/StepPropertyType";
import { JSX } from "react/jsx-runtime";

type Steps = { id: 0; name: "property-type"; component: JSX.Element };
// Future steps will extend here.
interface PropertyTypeStepData {
  category: "rent" | "sale" | string;
  propertyType: "apartment" | "house" | "condo" | string;
  condition: "good" | "fair" | "excellent" | "poor" | string;
}

const ListPropertyForm = () => {
  const [stepIndex, setStepIndex] = useState(0);

  const [formData, setFormData] = useState<PropertyTypeStepData>({
    category: "rent",
    propertyType: "apartment",
    condition: "good",
  });

  /* ---------- helpers ---------- */
  const updateStepOne = (patch: Partial<PropertyTypeStepData>) =>
    setFormData((prev) => ({ ...prev, ...patch }));

  const goNext = () => setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  const goPrev = () => setStepIndex((i) => Math.max(i - 1, 0));

  /* ---------- steps array ---------- */
  const steps: Steps[] = [
    {
      id: 0,
      name: "property-type",
      component: (
        <StepPropertyType
          data={formData}
          update={updateStepOne}
          next={goNext}
        />
      ),
    },
  ];

  return (
    <section className="min-h-screen bg-gray-50 flex flex-col">
      {/* optional sidebar / progress can go here */}
      <div className="flex-1 flex flex-col">
        {stepIndex > 0 && (
          <div className="max-w-3xl mx-auto w-full p-4 md:p-6">
            <button
              onClick={goPrev}
              className="text-sm text-[#C85212] hover:underline mb-4"
            >
              ← Previous
            </button>
          </div>
        )}

        {steps[stepIndex].component}
      </div>
    </section>
  );
};

export default ListPropertyForm;
