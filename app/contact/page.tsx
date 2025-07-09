"use client";
import { MessageCircle, Users } from 'lucide-react';

import ContactForm from '@/components/molecules/ContactForm';

const ContactPage = () => {
  // Custom form submission handler (optional)
  const handleFormSubmission = (formData: { fullName: string; email: string; message: string }) => {
    console.log('Custom form handler:', formData);
    // Add your custom form handling logic here
    // e.g., API call, validation, etc.
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact us
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We&#39;re here to help with all your needs and questions about the Finder services.
          </p>
        </div>

        {/* Contact Options */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Help Center */}
          <div className="text-center p-6">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Help center</h3>
            <p className="text-gray-600 mb-4">
              Check out Finder helpful blog articles for answers and tips.
            </p>
          </div>

          {/* Contact Support */}
          <div className="text-center p-6">
            <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <div className="bg-orange-500 rounded-full w-8 h-8 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Contact support</h3>
            <p className="text-gray-600 mb-4">
              Get in touch and we will be happy to help you!
            </p>
            <div className="text-sm text-gray-500">
              <p>support@example.com</p>
              <p>(234) 555-0120</p>
            </div>
          </div>

          {/* Community */}
          <div className="text-center p-6">
            <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
            <p className="text-gray-600 mb-4">
              We help you make informed decisions by giving you access to honest reviews and real experiences from people who&#39;ve lived in the exact addresses you&#39;re considering.
            </p>
          </div>
        </div>

        {/* Contact Form Section */}
        <ContactForm onSubmit={handleFormSubmission} />
      </main>
    </div>
  );
};

export default ContactPage;