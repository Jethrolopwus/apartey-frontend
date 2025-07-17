import React from 'react';

const ContentPolicy = () => (
  <div className="min-h-screen flex flex-col items-center bg-white py-12 px-2">
    <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm p-10">
      <h1 className="text-4xl font-semibold text-[#4E5562] mb-10 text-center">Content Moderation Policy</h1>
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Moderation Approach</h2>
        <ul className="list-disc list-inside text-gray-700 text-base space-y-1">
          <li>Hybrid of automated tools (keyword detection) and human review.</li>
          <li>Focused on identifying:
            <ul className="list-disc list-inside ml-6">
              <li>Defamation</li>
              <li>Fraudulent listings</li>
              <li>Spam</li>
              <li>Harmful/offensive content</li>
            </ul>
          </li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Reporting Mechanism</h2>
        <ul className="list-disc list-inside text-gray-700 text-base space-y-1">
          <li>Users may flag any listing, review, or content.</li>
          <li>A &quot;Report&quot; button is present on each user-generated item.</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Review & Action</h2>
        <ul className="list-disc list-inside text-gray-700 text-base space-y-1">
          <li>Reported content is reviewed within <span className="font-semibold">7 days</span>.</li>
          <li>Possible actions:
            <ul className="list-disc list-inside ml-6">
              <li>No action (content compliant)</li>
              <li>Content removal</li>
              <li>User warning</li>
              <li>Account suspension or ban (for severe or repeated violations)</li>
            </ul>
          </li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Appeals Process</h2>
        <ul className="list-disc list-inside text-gray-700 text-base space-y-1">
          <li>Users may appeal a moderation decision by contacting [support email].</li>
          <li>Appeals are reviewed within <span className="font-semibold">14 days</span>.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Transparency Reporting</h2>
        <ul className="list-disc list-inside text-gray-700 text-base space-y-1">
          <li>An annual report will be published showing:</li>
          <li className="ml-6">Number of takedowns</li>
          <li className="ml-6">Number of appeals</li>
          <li className="ml-6">Types of violations</li>
        </ul>
      </section>
    </div>
  </div>
);

export default ContentPolicy; 