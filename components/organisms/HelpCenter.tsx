"use client";
import React from "react";
import { MessageCircle, Mail, Phone } from "lucide-react";

export default function HelpCenter() {
  const faqs = [
    {
      question: "How do I search for properties?",
      answer:
        "Use our search filters to find properties by location, price range, and amenities.",
    },
    {
      question: "What types of properties are available?",
      answer:
        "We offer a variety of properties including apartments, houses, and commercial spaces.",
    },
    {
      question: "Can I schedule a property tour?",
      answer:
        "Yes, you can schedule a tour through our website or by contacting our agents.",
    },
    {
      question: "What is the process for making an offer?",
      answer:
        "You can submit an offer directly through our platform after viewing a property.",
    },
    {
      question: "Are there any fees associated with buying a property?",
      answer:
        "Property buyers typically incur closing costs, inspection fees, and agent commissions.",
    },
    {
      question: "How can I get assistance with financing?",
      answer:
        "We have partnerships with lenders who can provide mortgage assistance and advice.",
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">
          Help Center
        </h1>

        {/* Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Live Chat */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-4">
              <MessageCircle className="w-8 h-8 text-[#C85212]" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Live Chat
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Chat with our support team
            </p>
            <button className="text-sm text-[#C85212] hover:text-[#A64310] font-medium transition-colors">
              Start Chat
            </button>
          </div>

          {/* Email Support */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-4">
              <Mail className="w-8 h-8 text-[#C85212]" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Email Support
            </h3>
            <p className="text-sm text-gray-600 mb-4">Send us an email</p>
            <button className="text-sm text-[#C85212] hover:text-[#A64310] font-medium transition-colors">
              example@email.com
            </button>
          </div>

          {/* Phone Support */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-4">
              <Phone className="w-8 h-8 text-[#C85212]" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Phone Support
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Call us for immediate help
            </p>
            <button className="text-sm text-[#C85212] hover:text-[#A64310] font-medium transition-colors">
              +2348454492
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-xl font-medium text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0"
              >
                <h3 className="text-base font-medium text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
