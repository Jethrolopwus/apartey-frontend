import React from "react";
import { Building2, ShieldCheck, Contact } from "lucide-react";

const features = [
  {
    icon: <Building2 className="w-10 h-10 text-orange-300 mx-auto" />,
    title: "Project Showcase",
    description:
      "Showcase your projects and grow your business with our comprehensive platform",
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-orange-300 mx-auto" />,
    title: "Trust & Credibility",
    description:
      "Build trust through verified reviews and transparent business practices",
  },
  {
    icon: <Contact className="w-10 h-10 text-orange-300 mx-auto" />,
    title: "Lead Generation",
    description:
      "Connect with potential buyers and investors through our platform",
  },
];

const AgentsSection: React.FC = () => {
  return (
    <section className="w-full bg-white py-16 px-4 flex flex-col items-center">
      <h2 className="text-4xl md:text-5xl font-bold text-teal-800 text-center mb-3">
        Solutions for Developers & Agents
      </h2>
      <p className="text-gray-500 text-base md:text-lg text-center mb-12 max-w-2xl">
        Showcase your projects and grow your business with our comprehensive platform
      </p>
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-10">
        {features.map((feature, idx) => (
          <div key={idx} className="flex flex-col items-center text-center px-4">
            {feature.icon}
            <h3 className="mt-6 text-lg font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-600 max-w-xs">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AgentsSection; 