"use client";

import { PenSquare, Users, Gift } from 'lucide-react';

export default function ExperienceComponent() {
  const handleWriteReview = () => {
    console.log('Opening review form');
    // Add your logic for opening a review form/modal
  };
  const features = [
    {
      id: 1,
      icon: <PenSquare className="w-6 h-6 text-gray-700" />,
      title: "Write a review",
      description: "Share your honest experience about where..."
    },
    {
      id: 2,
      icon: <Users className="w-6 h-6 text-gray-700" />,
      title: "Help the Community",
      description: "Your insights help others make informed decisions"
    },
    {
      id: 3,
      icon: <Gift className="w-6 h-6 text-gray-700" />,
      title: "Earn Rewards",
      description: "Get exclusive benefits for being an active reviewer"
    }
  ];

  return (
    <div className="w-full bg-gray-100 py-12 px-4">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-medium text-gray-800 mb-3">Share Your Experience</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Help others find their perfect home by sharing your honest review. Your insights make a difference!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:mx-32 lg:mx-32 mb-10">
          {features.map((feature) => (
            <div key={feature.id} className="bg-white rounded-lg p-14 text-center shadow-sm">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center ">
          <button onClick={handleWriteReview} className="bg-[#C85212] cursor-pointer hover:bg-orange-700 text-white font-medium py-3 px-20 rounded-md transition duration-300">
            Leave a review
          </button>
        </div>
      </div>
    </div>
  );
}