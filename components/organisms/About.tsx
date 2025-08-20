"use client";

import React from "react";
import { useContactUsMutation } from '@/Hooks/use-contactUs.mutation';
import toast from 'react-hot-toast';

const About: React.FC = () => {
  const { mutate: sendMessage, isLoading } = useContactUsMutation();

  const handleContactClick = () => {
    // Create a default contact message
    const contactData = new FormData();
    contactData.append('fullName', 'Website Visitor');
    contactData.append('email', 'visitor@apartey.com');
    contactData.append('message', 'I would like to get in touch with the Apartey team regarding your services.');

    sendMessage(contactData, {
      onSuccess: () => {
        toast.success('Message sent successfully! We\'ll get back to you soon.');
      },
      onError: (error) => {
        toast.error('Failed to send message. Please try again.');
        console.error('Contact error:', error);
      }
    });
  };

  // const teamMembers: TeamMember[] = [
  //   {
  //     name: "Olivia",
  //     role: "Founder & CEO",
  //     description:
  //       "Former co-founder of Opendoor. Early staff at Spotify and ClassPa.",
  //     image: "/Ellipse-2.png",
  //   },
  //   {
  //     name: "Olivia Rhye",
  //     role: "Founder & CEO",
  //     description:
  //       "Former co-founder of Opendoor. Early staff at Spotify and ClassPa.",
  //     image: "/Ellipse-1.png",
  //   },
  //   {
  //     name: "Olivia Rhye",
  //     role: "Founder & CEO",
  //     description:
  //       "Former co-founder of Opendoor. Early staff at Spotify and ClassPa.",
  //     image: "/Ellipse-2.png",
  //   },
  // ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-teal-800 mb-4">
            About us
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your trusted platform for authentic property reviews and insights
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Our Mission
          </h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4 leading-relaxed">
              To eliminate regret from renting decisions by building a trusted
              platform that encourages transparency, accountability, and
              data-driven insights in the housing market through the reviews of
              past renters.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Apartey was founded with a simple but powerful mission: to bring
              transparency and trust to the rental market. We believe that
              everyone deserves to make informed decisions about where they
              live.
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              By creating a platform where renters can share their authentic
              experiences, we help future tenants make informed decisions while
              also providing property managers with valuable feedback to improve
              their offerings.
            </p>

            {/* Quote */}
            <div className="border-l-4 border-orange-500 pl-6 py-4 bg-orange-50 rounded-r-lg">
              <p className="text-gray-800 italic mb-2">
                &ldquo;We&apos;re building the resource we wish existed when we
                were hunting for our own apartments — honest reviews from real
                people who&apos;ve actually lived there.&rdquo;
              </p>
              <p className="text-gray-600 text-sm">- Apartey Founding Team</p>
            </div>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-gray-900 mb-12">
            What Makes Us Different
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Verified Reviews */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Verified Reviews
              </h3>
              <p className="text-gray-600 leading-relaxed">
                All reviews are from verified tenants who have actually lived in
                the properties they&apos;re reviewing, ensuring authentic
                feedback you can trust.
              </p>
            </div>

            {/* Comprehensive Ratings */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Comprehensive Ratings
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our detailed rating system covers everything from maintenance
                responsiveness to noise levels, giving you the complete picture.
              </p>
            </div>

            {/* Community Focused */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Community Focused
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We&apos;re building a community of renters helping renters - a
                safe space for honest management tips for actual marketplace for
                everyone.
              </p>
            </div>
          </div>
        </section>

        {/* <section className="mb-20">
          <h2 className="text-2xl font-semibold text-gray-900 mb-12 text-center">
            Meet our team
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full mx-auto object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-orange-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {member.description}
                </p>

            
                <div className="flex justify-center space-x-4">
                  <a href="#" className="text-gray-400 hover:text-gray-600">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-gray-600">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-gray-600">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section> */}

        <section className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Get in touch
          </h2>
          <p className="text-gray-600 mb-2">
            Have questions, feedback, or want to partner with us?
          </p>
          <p className="text-gray-600 mb-8">We&apos;d love to hear from you!</p>

          <button
            onClick={handleContactClick}
            disabled={isLoading}
            className="px-14 py-3 text-sm font-medium text-white rounded-md hover:opacity-90 transition-opacity inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#C85212" }}
          >
            {isLoading ? 'Sending...' : 'Contact us'}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </button>
        </section>
      </main>
    </div>
  );
};

export default About;
