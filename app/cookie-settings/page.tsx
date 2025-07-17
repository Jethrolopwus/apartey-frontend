"use client";
import React from "react";

const CookieSettings: React.FC = () => {
  // All toggles are ON by default
  const [cookies, setCookies] = React.useState({
    necessary: true,
    functional: true,
    analytics: true,
    marketing: true,
    thirdParty: true,
  });

  // Toggle handler (not strictly needed since all are ON, but for completeness)
  const handleToggle = (key: keyof typeof cookies) => {
    setCookies((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-12 text-gray-800 bg-white rounded-lg shadow-sm mt-8 mb-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#4E5562]">Cookie Settings</h1>
      <p className="text-gray-600 mb-4">
        We use cookies and similar technologies to provide, protect, and improve our services. This page allows you to control which cookies we can use, in compliance with GDPR and ePrivacy regulations.
      </p>
      <div className="rounded-md p-4 mb-8 bg-[#F8DFD2] border-l-4 border-[#C85212]">
        <span className="block text-sm font-medium text-gray-800 mb-1"> <b>Your Rights: </b>  Under GDPR, you have the right to control non-essential cookies. You can change these settings at any time by returning to this page.
          </span>
      </div>

      {/* Cookie Categories */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-gray-900">Necessary Cookies</h2>
          <Toggle checked={cookies.necessary} onChange={() => handleToggle("necessary")}/>
        </div>
        <p className="text-gray-700 text-sm mb-1">Required for basic website functionality</p>
        <p className="text-gray-600 text-sm mb-1">These cookies are essential for you to browse our website and use its features. They enable basic functions like page navigation, access to secure areas, and form submissions.</p>
        <p className="text-xs text-gray-500 mb-2">Example: Session cookies, security tokens, load balancing cookies</p>
      </section>

      <section className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-gray-900">Functional Cookies</h2>
          <Toggle checked={cookies.functional} onChange={() => handleToggle("functional")}/>
        </div>
        <p className="text-gray-700 text-sm mb-1">Enhance website functionality and personalization</p>
        <p className="text-gray-600 text-sm mb-1">These cookies allow us to remember choices you make and provide enhanced features. They help us personalize your experience and remember your preferences.</p>
        <p className="text-xs text-gray-500 mb-2">Examples: Language preferences, saved searches, favorite properties, accessibility settings</p>
      </section>

      <section className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-gray-900">Analytics Cookies</h2>
          <Toggle checked={cookies.analytics} onChange={() => handleToggle("analytics")}/>
        </div>
        <p className="text-gray-700 text-sm mb-1">Collect data to help us improve our website</p>
        <p className="text-gray-600 text-sm mb-1">These cookies collect information about how visitors use our website. All information is aggregated and anonymous. Helps us improve our services.</p>
        <p className="text-xs text-gray-500 mb-2">Examples: Google Analytics, page views, session duration, popular property searches</p>
      </section>

      <section className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-gray-900">Marketing Cookies</h2>
          <Toggle checked={cookies.marketing} onChange={() => handleToggle("marketing")}/>
        </div>
        <p className="text-gray-700 text-sm mb-1">Used to deliver relevant advertisements</p>
        <p className="text-gray-600 text-sm mb-1">These cookies track your activity across websites to deliver targeted advertising. They help us show you relevant property listings and housing services.</p>
        <p className="text-xs text-gray-500 mb-2">Examples: Facebook Pixel, Google Ads, retargeting cookies, conversion tracking</p>
      </section>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-gray-900">Third-Party Cookies</h2>
          <Toggle checked={cookies.thirdParty} onChange={() => handleToggle("thirdParty")}/>
        </div>
        <p className="text-gray-700 text-sm mb-1">Cookies from external services and partners</p>
        <p className="text-gray-600 text-sm mb-1">These cookies are set by our trusted partners to provide additional functionality like social media integration, customer support chat, and payment processing.</p>
        <p className="text-xs text-gray-500 mb-2">Examples: Social media widgets, live chat support, payment gateways, mapping services</p>
      </section>

      {/* Additional Information */}
      <section className="mb-8">
        <h3 className="text-base font-semibold text-gray-900 mb-2">Additional Information</h3>
        <ul className="text-sm text-gray-700 mb-2 list-disc list-inside">
          <li><span className="font-medium">Session cookies:</span> Deleted when you close your browser</li>
          <li><span className="font-medium">Functional cookies:</span> Up to 2 years</li>
          <li><span className="font-medium">Analytics cookies:</span> 26 months (Google Analytics standard)</li>
          <li><span className="font-medium">Marketing cookies:</span> Up to 1 year</li>
        </ul>
        <p className="text-xs text-gray-500 mb-2">
          <span className="font-medium">Managing Cookies:</span> You can also manage cookies through your browser settings. However, disabling cookies may affect website functionality. For more information about cookies and how to manage them, visit <a href="https://allaboutcookies.org" className="underline text-blue-600" target="_blank" rel="noopener noreferrer">allaboutcookies.org</a>
        </p>
      </section>

      {/* Contact Information */}
      <section className="mb-8">
        <h3 className="text-base font-semibold text-gray-900 mb-2">Contact Information</h3>
        <p className="text-sm text-gray-700 mb-2">For any privacy-related questions or to exercise your rights, please contact:</p>
        <div className="rounded-md p-4 mb-2 bg-[#F8DFD2]  border-l-4 border-[#C85212]">
          <div className="text-sm text-gray-800 font-medium mb-1">privacy@apartey.com</div>
          <div className="text-sm text-gray-700 mb-1">+1 (123) 456-7890</div>
          <div className="text-xs text-gray-500">*We will respond to your request within 30 days as required by GDPR.</div>
        </div>
      </section>

      {/* Button Row */}
      <div className="flex flex-col md:flex-row gap-3 mt-6">
        <button
          className="flex-1 py-3 rounded-md text-[#FAFAFA] font-semibold text-lg shadow-sm transition-colors"
          style={{ background: "#C85212" }}
        >
          Save my preference
        </button>
        <button
          className="flex-1 py-3 rounded-md border-1 border-[#056827] text-[#056827] font-semibold text-lg bg-white shadow-sm transition-colors hover:bg-orange-50"
          type="button"
        >
          Accept all cookies
        </button>
        <button
          className="flex-1 py-3 rounded-md border-1 border-[#D85151]  text-[#D85151] font-semibold text-lg bg-white shadow-sm transition-colors hover:bg-gray-50"
          type="button"
        >
          Reject Non essentials
        </button>
      </div>
    </main>
  );
};

// Toggle switch component
interface ToggleProps {
  checked: boolean;
  onChange: () => void;
}
const Toggle: React.FC<ToggleProps> = ({ checked, onChange }) => (
  <button
    type="button"
    aria-pressed={checked}
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 ${checked ? 'bg-orange-500' : 'bg-gray-300'}`}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`}
    />
  </button>
);

export default CookieSettings; 