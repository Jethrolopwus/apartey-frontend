'use client';

import { Building2, ShieldCheck, Contact } from 'lucide-react';
import React, { JSX } from 'react';

type Tool = {
  icon: JSX.Element;
  title: string;
  description: string;
};

const tools: Tool[] = [
  {
    icon: <Building2 className="w-10 h-10 text-orange-300" />,
    title: 'Project Showcase',
    description:
      'Showcase your projects and grow your business with our comprehensive platform',
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-orange-300" />,
    title: 'Trust & Credibility',
    description:
      'Build trust through verified reviews and transparent business practices',
  },
  {
    icon: <Contact className="w-10 h-10 text-orange-300" />,
    title: 'Lead Generation',
    description:
      'Connect with potential buyers and investors through our platform',
  },
];

const AgentsToolSection: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-white text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-teal-800">
        Solutions for Developers & Agents
      </h2>
      <p className="mt-2 text-sm md:text-base text-gray-600 max-w-xl mx-auto">
        Showcase your projects and grow your business with our comprehensive platform
      </p>

      <div className="mt-12 grid gap-10 sm:grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto">
        {tools.map((tool, index) => (
          <div key={index} className="flex flex-col items-center px-4">
            {tool.icon}
            <h3 className="mt-4 text-lg font-semibold text-gray-900">{tool.title}</h3>
            <p className="mt-2 text-sm text-gray-600 max-w-xs">{tool.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AgentsToolSection;
