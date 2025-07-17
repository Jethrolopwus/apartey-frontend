"use client";
import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-gray-800 bg-white rounded-lg shadow-sm mt-8 mb-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-[#4E5562]">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: 6/24/2025</p>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2 text-gray-900">What Information we Collect</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            <span className="font-medium">Account Information:</span> We collect your name, email address, and optionally, your phone number when you create an account on Apartey.
          </li>
          <li>
            <span className="font-medium">Location Information:</span> We collect the address of the property you are reviewing or listing, as well as your approximate location for service relevance and content localization.
          </li>
          <li>
            <span className="font-medium">Usage Data:</span> This includes your activity on the platform such as pages visited, searches performed, listings interacted with, and reviews submitted.
          </li>
          <li>
            <span className="font-medium">User-Generated Content:</span> This covers all content you post, including reviews, property listings, messages, comments, and uploaded documents (e.g., lease agreements).
          </li>
          <li>
            <span className="font-medium">Device Data:</span> We collect information such as your IP address, browser type, operating system, and cookies to enhance user experience and for compliance (e.g., GDPR and NDPR).
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2 text-gray-900">How we Use Your Information</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>To operate and improve the platform, including displaying listings, publishing reviews, managing home swaps, and generating housing insights.</li>
          <li>To communicate with you about account-related matters, service updates, new features, promotions, and customer support.</li>
          <li>To ensure trust and safety through content moderation, account verification, dispute resolution, and fraud detection.</li>
          <li>To comply with applicable laws and regulations, including data privacy laws in the EU (GDPR) and Nigeria (NDPR).</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2 text-gray-900">Legal Basis for Processing (EU Users)</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li><span className="font-medium">Performance of a Contract:</span> Processing necessary to provide services through Apartey.</li>
          <li><span className="font-medium">Compliance with Legal Obligations:</span> To comply with applicable laws and law enforcement requests.</li>
          <li><span className="font-medium">Legitimate Interests:</span> To ensure platform security, prevent fraud, and improve our services.</li>
          <li><span className="font-medium">Consent:</span> Where required, we will seek your consent, e.g., for marketing communications or cookie tracking.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2 text-gray-900">Data Sharing</h2>
        <p className="mb-2 text-gray-700">We do <span className="font-bold">not sell your personal data</span>.</p>
        <p className="mb-2 text-gray-700">We may share data with:</p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li><span className="font-medium">Service providers</span> (e.g., web hosting, analytics, and customer support platforms).</li>
          <li><span className="font-medium">Law enforcement or regulators</span>, if required by law or to protect the rights, property, or safety of Apartey, its users, or others.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2 text-gray-900">Data Storage & Sharing</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Data is securely stored on servers located within the <span className="font-medium">EU</span> and <span className="font-medium">Nigeria</span>.</li>
          <li>Where cross-border data transfers occur (e.g., for hosting or analytics), we apply appropriate safeguards, such as standard contractual clauses or privacy shield certifications where applicable.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2 text-gray-900">Your Rights (EU and Nigeria)</h2>
        <p className="mb-2 text-gray-700">As a user, you have the following rights:</p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li><span className="font-medium">Access</span> your personal data</li>
          <li><span className="font-medium">Rectify or delete</span> your personal data</li>
          <li><span className="font-medium">Object to</span> or restrict certain types of processing</li>
          <li><span className="font-medium">Data portability</span> — request a copy of your data in a machine-readable format</li>
          <li><span className="font-medium">Lodge a complaint</span> with a data protection authority if you believe your rights have been violated</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2 text-gray-900">Retention</h2>
        <p className="text-gray-700">We retain your data for as long as it is necessary to provide our services, comply with legal obligations, and resolve disputes. You may request deletion of your data, and we will honor that request unless we are legally obligated to retain it.</p>
      </section>

      <section className="mb-2">
        <h2 className="text-lg font-semibold mb-2 text-gray-900">Cookies</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Enable platform functionality (e.g., keeping you logged in)</li>
          <li>Collect analytics to improve the user experience</li>
          <li>Comply with EU cookie consent laws through a clear consent banner for EU users</li>
        </ul>
      </section>
    </main>
  );
};

export default PrivacyPolicy; 