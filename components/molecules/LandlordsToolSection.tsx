import React from 'react';
import { Home, BarChart3, Users } from 'lucide-react';

const LandlordsToolsSection = () => {
  const tools = [
    {
      icon: Home,
      title: "Property Management",
      description: "Manage all your properties from one dashboard with easy listing tools"
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Track performance metrics and tenant feedback to optimize your properties"
    },
    {
      icon: Users,
      title: "Tenant Connection",
      description: "Connect with quality tenants and build lasting relationships"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-teal-800 mb-4">
            Powerful Tools for Landlords
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your properties efficiently and connect with quality tenants
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {tools.map((tool, index) => {
            const IconComponent = tool.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 text-center group"
              >
                {/* Icon */}
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-200 transition-colors duration-300">
                  <IconComponent className="w-8 h-8 text-orange-600" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {tool.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {tool.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LandlordsToolsSection;