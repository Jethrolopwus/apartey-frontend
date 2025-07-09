"use client";
import React, { forwardRef, useImperativeHandle } from 'react';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';

interface SubmitReviewComponentProps {
  isAnonymous: boolean;
  agreeToTerms: boolean;
  onAnonymousChange: (checked: boolean) => void;
  onTermsChange: (checked: boolean) => void;
}

const SubmitReviewComponent = forwardRef<{ handleFinalSubmit: () => Promise<unknown> }, SubmitReviewComponentProps>((props, ref) => {
  const { isAnonymous, agreeToTerms, onAnonymousChange, onTermsChange } = props;

  // This function can be called by the parent to submit the review
  const handleFinalSubmit = async () => {
    if (!agreeToTerms) {
      toast.error('Please agree to the terms and conditions to continue');
      return false;
    }
    // Return the form data for final submission
    return {
      submitAnonymously: isAnonymous,
      agreeToTerms: agreeToTerms,
      submittedAt: new Date().toISOString(),
    };
  };

  useImperativeHandle(ref, () => ({ handleFinalSubmit }));

  return (
    <div className={`space-y-6`}>
      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-6">
        <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
        <span className="text-sm text-gray-600">
          Almost there! Just a few more details and you&apos;re done
        </span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Submit your Review
        </h2>
        <p className="text-sm text-gray-600">
          Enter your information to complete your review
        </p>
      </div>

      {/* Anonymous submission checkbox */}
      <div className="flex items-center gap-3 mb-6">
        <input
          type="checkbox"
          id="anonymous"
          checked={isAnonymous}
          onChange={(e) => onAnonymousChange(e.target.checked)}
          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
        />
        <label htmlFor="anonymous" className="text-sm text-gray-700 cursor-pointer">
          Submit your review Anonymously?
        </label>
      </div>

      {/* Terms and Conditions */}
      <div className="border border-gray-200 rounded-lg p-6 space-y-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Terms and Conditions
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Please review and accept our terms
          </p>
        </div>

        {/* Terms content box */}
        <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
          <p className="text-sm text-gray-700 mb-2">
            <strong>By submitting this review, you confirm that:</strong>
          </p>
          <ul className="text-sm text-gray-700 space-y-1 ml-4">
            <li>• You have personally lived at this property</li>
            <li>• Your review is honest and based on your own experience</li>
            <li>• You are not affiliated with the property owner or management</li>
            <li>• All information provided is accurate to the best of your knowledge</li>
          </ul>
        </div>

        {/* Agreement checkbox */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="terms"
            checked={agreeToTerms}
            onChange={(e) => onTermsChange(e.target.checked)}
            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mt-0.5"
          />
          <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
            I agree to the terms of use and privacy policy
          </label>
        </div>
      </div>
    </div>
  );
});

SubmitReviewComponent.displayName = 'SubmitReviewComponent';

export default SubmitReviewComponent;