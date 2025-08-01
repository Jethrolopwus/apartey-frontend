"use client";
import React, { useState } from "react";
import {
  MessageCircle,
  Mail,
  Phone,
  PlusCircle,
  MinusCircle,
} from "lucide-react";

export default function HelpCenter() {
  const faqs = [
    {
      question: "What is Apartey?",
      answer:
        "Apartey is a community-powered platform that helps people make smarter housing decisions. You can find honest home reviews, swap homes, list or rent properties, and connect with trusted service providers, all in one place.",
    },
    {
      question: "Is Apartey free to use?",
      answer:
        "Yes! Most features are free to use. We also offer a free trial for premium features like advanced housing insights and direct landlord messaging. You can choose to upgrade later.",
    },
    {
      question: "Who can use Apartey?",
      answer:
        "Renters, landlords/homeowners, developers, and agents. You can even switch profiles (e.g., from renter to landlord) without registering again—as long as you provide the necessary documentation.",
    },
    {
      question: "What are Apartey Keys?",
      answer:
        "Apartey Keys are reward tokens you earn by using the platform—like leaving reviews, referring friends, or completing your profile. You can redeem them for discounts, premium access, and other perks.",
    },
    {
      question: "How do I leave a review for a home I've lived in?",
      answer:
        "Simply search or add the property, then follow the review prompts to rate your experience—like rent, neighborhood, landlord response, etc.",
    },
    {
      question: "What if my apartment was in a block of flats with no number?",
      answer:
        "We've made it easy! You can select the building and then use our guided description tool to describe your exact flat's location (e.g., \"middle flat upstairs, left of entrance\").",
    },
    {
      question: "Can I trust the reviews on Apartey?",
      answer:
        "Yes. Reviews are verified using multiple signals, including address data, cross-checks with utility data, and community flags.",
    },
    {
      question: "How do I list my property?",
      answer:
        "Once you switch to a landlord or agent profile, go to your dashboard and click \"Create Listing.\" You'll be guided through uploading photos, setting terms, and adding your property's location.",
    },
    {
      question: "Can I respond to reviews about my property?",
      answer:
        "Yes. Verified property owners and managers can respond professionally to reviews and flag inaccuracies for investigation.",
    },
    {
      question: "How does pricing work for landlords and agents?",
      answer:
        "We offer both free and premium listing options. You can also subscribe to insights on tenant preferences and market trends.",
    },
    {
      question: "How do you protect my personal data?",
      answer:
        "We use encrypted storage, strict verification processes, and never share your personal info without consent. You control your privacy settings.",
    },
    {
      question: "Can I delete or edit my review later?",
      answer:
        "Yes, you can edit or delete reviews from your profile. We encourage transparency, but we respect your right to update your experience.",
    },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

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
                <button
                  className="flex items-center justify-between w-full text-left"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openFaq === index}
                  aria-controls={`faq-${index}-content`}
                >
                  <h3 className="text-base font-medium text-gray-900">
                    {faq.question}
                  </h3>
                  {openFaq === index ? (
                    <MinusCircle className="w-6 h-6 text-[#C85212] cursor-pointer" />
                  ) : (
                    <PlusCircle className="w-6 h-6 text-[#C85212] cursor-pointer" />
                  )}
                </button>
                <div
                  id={`faq-${index}-content`}
                  className="mt-2 text-sm text-gray-600 leading-relaxed overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: openFaq === index ? "1000px" : "0",
                    opacity: openFaq === index ? 1 : 0,
                  }}
                >
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
