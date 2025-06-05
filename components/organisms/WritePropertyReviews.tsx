
// "use client";
// import React, { useRef, useState } from 'react';
// import { ChevronDown, Calendar, Home, Star, MessageSquare } from 'lucide-react';
// import RatingComponent from '@/components/molecules/ReviewsRating';
// import SubmitReviewComponent from '@/components/organisms/SubmitReviews';
// import LocationForm from '../molecules/LocationForm';

// export const WritePropertyReview = () => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [canSubmit, setCanSubmit] = useState(false);
//   const submitReviewRef = useRef(null);
//   const [currentSubStep, setCurrentSubStep] = useState(1); // For step 2 sub-steps
//   const [formData, setFormData] = useState({
//     // Step 1 - Property Details
//     country: '',
//     address: '',
//     apartmentNumber: '',
//     numberOfRooms: '',
//     numberOfOccupants: '',
//     moveOutDate: 'May 2025',
//     additionalComments: '',
    
//     // Step 2A - Cost Details
//     nearestPublicTransport: '',
//     rentType: 'actual', // 'actual' or 'range'
//     yearlyRent: 'NGN300,000',
//     securityDepositRequired: false,
//     agentFeeRequired: false,
//     fixedUtilityCost: false,
//     centralHeating: false,
//     furnished: false,
//     julyUtilities: '',
//     januaryUtilities: '',
    
//     // Step 2B - Amenities & Accessibility
//     appliances: {
//       oven: false,
//       washingMachine: false,
//       refrigerator: false,
//       garbageDisposal: false,
//       airConditioner: false,
//       dryer: false,
//       microwave: false,
//       others: false
//     },
//     landlordLanguages: {
//       english: false,
//       french: false,
//       estonian: false,
//       italian: false,
//       spanish: false,
//       german: false,
//       others: false,
//       customLanguage: '',
//       otherText: ''
//     },
//     buildingFacilities: {
//       parkingLot: false as boolean,
//       streetParking: false as boolean,
//       gymFitness: false as boolean,
//       elevator: false as boolean,
//       storageSpace: false as boolean,
//       childrenPlayArea: false as boolean,
//       roofTerrace: false as boolean,
//       securitySystem: false as boolean,
//       dedicatedParking: false as boolean,
//       swimmingPool: false as boolean,
//       gardenCourtyard: false as boolean,
//       others: false as boolean,
//       otherText: '' as string
//     },
//     nearestGroceryStore: '',
//     nearestPark: '',
    
//     // Step 2C - Ratings & Reviews
//     valueForMoney: 0,
//     costOfRepairs: '', // 'tenant', 'landlord', 'split', 'depends'
//     overallExperience: 0,
//     detailedReview: '',
    
//     // Step 3 - Submit Review
//     submitAnonymously: false,
//     agreeToTerms: false
//   });

//   const updateFormData = (field: string, value: string | boolean) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   type FormDataCategory = keyof typeof formData;
  
//   const updateNestedFormData = (category: FormDataCategory, field: string, value: string | boolean) => {
//     setFormData(prev => ({
//       ...prev,
//       [category]: {
//         ...(typeof prev[category] === 'object' ? prev[category] : {}),
//         [field]: value
//       }
//     }));
//   };

//   const nextStep = () => {
//     if (currentStep === 1) {
//       setCurrentStep(2);
//       setCurrentSubStep(1);
//     } else if (currentStep === 2) {
//       if (currentSubStep < 3) {
//         setCurrentSubStep(currentSubStep + 1);
//       } else {
//         setCurrentStep(3);
//       }
//     }
//   };

//   const prevStep = () => {
//     if (currentStep === 3) {
//       setCurrentStep(2);
//       setCurrentSubStep(3);
//     } else if (currentStep === 2) {
//       if (currentSubStep > 1) {
//         setCurrentSubStep(currentSubStep - 1);
//       } else {
//         setCurrentStep(1);
//       }
//     }
//   };
//   const handleFinalSubmit = async () => {
//     if (!canSubmit) {
//       alert('Please agree to the terms and conditions to continue');
//       return;
//     }

//     setIsSubmitting(true);
    
//     try {
//       // Call your submission logic here
//       // This could be an API call or whatever submission logic you have
//       console.log('Submitting review...');
      
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       console.log('Review submitted successfully!');
//       // You might want to redirect or show success message here
      
//     } catch (error) {
//       console.error('Error submitting review:', error);
//       alert('There was an error submitting your review. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleTermsChange = (agreed: boolean | ((prevState: boolean) => boolean)) => {
//     setCanSubmit(agreed);
//   };


//   const StarRating = ({ rating, onRatingChange, label }: { rating: number, onRatingChange: (rating: number) => void, label: string }) => (
//     <div className="space-y-2">
//       <label className="block text-sm font-medium text-gray-700">{label}</label>
//       <div className="flex space-x-1">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <Star
//             key={star}
//             className={`w-6 h-6 cursor-pointer transition-colors ${
//               star <= rating ? 'fill-orange-400 text-orange-400' : 'text-gray-300'
//             }`}
//             onClick={() => onRatingChange(star)}
//           />
//         ))}
//       </div>
//     </div>
//   );

//   const getCurrentStepTitle = () => {
//     if (currentStep === 1) return "Property Details";
//     if (currentStep === 2) return "Experience and Ratings";
//     if (currentStep === 3) return "Submit Review";
//     return "";
//   };

//   const getCurrentSubStepTitle = () => {
//     if (currentStep === 2) {
//       if (currentSubStep === 1) return "Cost Details";
//       if (currentSubStep === 2) return "Amenities & Accessibility";
//       if (currentSubStep === 3) return "Ratings & Reviews";
//     }
//     return "";
//   };

//   const getCurrentStepMessage = () => {
//     if (currentStep === 1) return "Let's start your property review journey! Tell us about your place.";
//     if (currentStep === 2 && currentSubStep === 1) return "You're doing great! Now let's dive into your experience.";
//     if (currentStep === 2 && currentSubStep === 2) return "Tell us about the property's amenities and location";
//     if (currentStep === 2 && currentSubStep === 3) return "Rate your experience with this property";
//     if (currentStep === 3) return "Almost there! Just a few more details and you're done";
//     return "";
//   };

//   const handleSubmit = () => {
//     // Handle form submission
//     console.log('Form submitted:', formData);
//     alert('Review submitted successfully!');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Main Content */}
//       <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//         {/* Title */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-teal-700 mb-2">Write a Property Review</h1>
//           <p className="text-gray-600">Share your honest opinion about a property to help others make informed decisions.</p>
//         </div>

//         {/* Progress Steps */}
//         <div className="bg-orange-100 rounded-lg p-6 mb-8">
//           <div className="flex items-center justify-between">
//             <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-orange-600' : 'text-gray-400'}`}>
//               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
//                 currentStep >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-300 text-gray-600'
//               }`}>
//                 {currentStep > 1 ? '✓' : '1'}
//               </div>
//               <span className="text-sm font-medium">Property Details</span>
//             </div>
//             <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-orange-600' : 'text-gray-400'}`}>
//               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
//                 currentStep >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-300 text-gray-600'
//               }`}>
//                 {currentStep > 2 ? '✓' : '2'}
//               </div>
//               <span className="text-sm font-medium">Experience and Ratings</span>
//             </div>
//             <div className={`flex items-center space-x-2 ${currentStep >= 3 ? 'text-orange-600' : 'text-gray-400'}`}>
//               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
//                 currentStep >= 3 ? 'bg-orange-600 text-white' : 'bg-gray-300 text-gray-600'
//               }`}>
//                 3
//               </div>
//               <span className="text-sm font-medium">Submit Review</span>
//             </div>
//           </div>
//         </div>

//         {/* Progress Message */}
//         {currentStep === 2 && (
//           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
//             <p className="text-yellow-700 text-sm flex items-center">
//               <span className="mr-2">👋</span>
//               {getCurrentStepMessage()}
//             </p>
//           </div>
//         )}

//         {/* Form Content */}
//         <div className="bg-white rounded-lg shadow-sm p-8">
//           {/* Step 1: Property Details */}
//           {currentStep === 1 && (
//             <div>
//               <div className="mb-6">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-2">{getCurrentStepTitle()}</h2>
//                 <p className="text-gray-600 flex items-center">
//                   <Home className="w-4 h-4 mr-1" />
//                   {getCurrentStepMessage()}
//                 </p>
//               </div>

//               <div className="space-y-6">
//                 {/* Location */}
//                 <LocationForm/>

//                 {/* Address */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Address <span className="text-gray-400 text-xs ml-1">ⓘ</span>
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="Enter Billing Address"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                     value={formData.address}
//                     onChange={(e) => updateFormData('address', e.target.value)}
//                   />
//                 </div>

//                 {/* Apartment/Unit Number */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Apartment/Unit Number</label>
//                   <input
//                     type="text"
//                     placeholder="enter Apartment/Unit Number"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                     value={formData.apartmentNumber}
//                     onChange={(e) => updateFormData('apartmentNumber', e.target.value)}
//                   />
//                 </div>

//                 {/* Number of Rooms and Occupants */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Number of Rooms</label>
//                     <input
//                       type="text"
//                       placeholder="e.g. 2"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                       value={formData.numberOfRooms}
//                       onChange={(e) => updateFormData('numberOfRooms', e.target.value)}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Number of Occupants</label>
//                     <input
//                       type="text"
//                       placeholder="e.g. 4"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                       value={formData.numberOfOccupants}
//                       onChange={(e) => updateFormData('numberOfOccupants', e.target.value)}
//                     />
//                   </div>
//                 </div>

//                 {/* Move Out Date */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">When did you leave this property?</label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       value={formData.moveOutDate}
//                       onChange={(e) => updateFormData('moveOutDate', e.target.value)}
//                       className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                     />
//                     <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Step 2: Experience and Ratings */}
//           {currentStep === 2 && (
//             <div>
//               {/* Step 2A: Cost Details */}
//               {currentSubStep === 1 && (
//                 <div>
//                   <div className="mb-6">
//                     <h2 className="text-xl font-semibold text-gray-900 mb-2">{getCurrentSubStepTitle()}</h2>
//                     <p className="text-gray-600">Tell us about the rental costs</p>
//                   </div>

//                   <div className="space-y-6">
//                     {/* Rent */}
//                     <div className="border border-gray-200 rounded-lg p-4">
//                       <h3 className="font-medium text-gray-900 mb-2">Rent</h3>
//                       <p className="text-sm text-gray-600 mb-4">Enter your yearly rent amount</p>
                      
//                       <div className="space-y-3">
//                         <div className="flex items-center space-x-2">
//                           <input
//                             type="radio"
//                             id="actual"
//                             name="rentType"
//                             checked={formData.rentType === 'actual'}
//                             onChange={() => updateFormData('rentType', 'actual')}
//                             className="w-4 h-4 text-orange-600"
//                           />
//                           <label htmlFor="actual" className="text-sm text-gray-700">Actual amount</label>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <input
//                             type="radio"
//                             id="range"
//                             name="rentType"
//                             checked={formData.rentType === 'range'}
//                             onChange={() => updateFormData('rentType', 'range')}
//                             className="w-4 h-4 text-orange-600"
//                           />
//                           <label htmlFor="range" className="text-sm text-gray-700">Range</label>
//                         </div>
//                       </div>

//                       <div className="mt-4">
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Yearly Rent</label>
//                         <input
//                           type="text"
//                           value={formData.yearlyRent}
//                           onChange={(e) => updateFormData('yearlyRent', e.target.value)}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                         />
//                       </div>
//                     </div>

//                     {/* Security Deposit */}
//                     <div className="border border-gray-200 rounded-lg p-4">
//                       <h3 className="font-medium text-gray-900 mb-2">Security Deposit</h3>
//                       <p className="text-sm text-gray-600 mb-4">Information about your security deposit</p>
                      
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm text-gray-700">Was a security deposit required?</span>
//                         <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
//                           <input
//                             type="checkbox"
//                             checked={formData.securityDepositRequired}
//                             onChange={(e) => updateFormData('securityDepositRequired', e.target.checked)}
//                             className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
//                           />
//                           <label className={`toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${formData.securityDepositRequired ? 'bg-orange-500' : ''}`}></label>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Agent/Broker Fees */}
//                     <div className="border border-gray-200 rounded-lg p-4">
//                       <h3 className="font-medium text-gray-900 mb-2">Agent/Broker Fees</h3>
//                       <p className="text-sm text-gray-600 mb-4">Information about any agent or broker fees</p>
                      
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm text-gray-700">Was an agent/broker fee required?</span>
//                         <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
//                           <input
//                             type="checkbox"
//                             checked={formData.agentFeeRequired}
//                             onChange={(e) => updateFormData('agentFeeRequired', e.target.checked)}
//                             className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
//                           />
//                           <label className={`toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${formData.agentFeeRequired ? 'bg-orange-500' : ''}`}></label>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Utilities & Amenities */}
//                     <div>
//                       <h3 className="font-medium text-gray-900 mb-4">Utilities & Amenities</h3>
//                       <p className="text-sm text-gray-600 mb-4">Tell us about the utilities and features</p>
                      
//                       <div className="border border-gray-200 rounded-lg p-4 space-y-4">
//                         <h4 className="font-medium text-gray-900">Utilities</h4>
//                         <p className="text-sm text-gray-600">Information about utility costs and features</p>
                        
//                         <div className="space-y-3">
//                           <div className="flex items-center justify-between">
//                             <span className="text-sm text-gray-700">Fixed utility cost</span>
//                             <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
//                               <input
//                                 type="checkbox"
//                                 checked={formData.fixedUtilityCost}
//                                 onChange={(e) => updateFormData('fixedUtilityCost', e.target.checked)}
//                                 className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
//                               />
//                               <label className={`toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${formData.fixedUtilityCost ? 'bg-orange-500' : ''}`}></label>
//                             </div>
//                           </div>
                          
//                           <div className="flex items-center justify-between">
//                             <span className="text-sm text-gray-700">Central Heating</span>
//                             <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
//                               <input
//                                 type="checkbox"
//                                 checked={formData.centralHeating}
//                                 onChange={(e) => updateFormData('centralHeating', e.target.checked)}
//                                 className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
//                               />
//                               <label className={`toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${formData.centralHeating ? 'bg-orange-500' : ''}`}></label>
//                             </div>
//                           </div>
                          
//                           <div className="flex items-center justify-between">
//                             <span className="text-sm text-gray-700">Furnished</span>
//                             <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
//                               <input
//                                 type="checkbox"
//                                 checked={formData.furnished}
//                                 onChange={(e) => updateFormData('furnished', e.target.checked)}
//                                 className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
//                               />
//                               <label className={`toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${formData.furnished ? 'bg-orange-500' : ''}`}></label>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Utility Costs */}
//                       <div className="border border-gray-200 rounded-lg p-4 mt-4">
//                         <h4 className="font-medium text-gray-900 mb-2">Utility Costs</h4>
//                         <p className="text-sm text-gray-600 mb-4">Share your seasonal utility costs</p>
                        
//                         <div className="space-y-4">
//                           <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">July (Summer) Utilities</label>
//                             <input
//                               type="text"
//                               placeholder="e.g. NGN300,000"
//                               value={formData.julyUtilities}
//                               onChange={(e) => updateFormData('julyUtilities', e.target.value)}
//                               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">January (Winter) Utilities</label>
//                             <input
//                               type="text"
//                               placeholder="e.g. NGN300,000"
//                               value={formData.januaryUtilities}
//                               onChange={(e) => updateFormData('januaryUtilities', e.target.value)}
//                               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Step 2B: Amenities & Accessibility */}
//               {currentSubStep === 2 && (
//                 <div>
//                   <div className="mb-6">
//                     <h2 className="text-xl font-semibold text-gray-900 mb-2">{getCurrentSubStepTitle()}</h2>
//                     <p className="text-gray-600">{getCurrentStepMessage()}</p>
//                   </div>

//                   <div className="space-y-6">
//                     {/* Appliances & Fixtures */}
//                     <div className="border border-gray-200 rounded-lg p-4">
//                       <h3 className="font-medium text-gray-900 mb-2">Appliances & Fixtures</h3>
//                       <p className="text-sm text-gray-600 mb-4">Select all appliances and fixtures that were included</p>
                      
//                       <div className="grid grid-cols-2 gap-3">
//                         {[
//                           { key: 'oven' as keyof typeof formData.appliances, label: 'Oven' },
//                           { key: 'airConditioner' as keyof typeof formData.appliances, label: 'Air conditioner' },
//                           { key: 'washingMachine' as keyof typeof formData.appliances, label: 'Washing machine' },
//                           { key: 'dryer' as keyof typeof formData.appliances, label: 'Dryer' },
//                           { key: 'refrigerator' as keyof typeof formData.appliances, label: 'Refrigerator' },
//                           { key: 'microwave' as keyof typeof formData.appliances, label: 'Microwave' },
//                           { key: 'garbageDisposal' as keyof typeof formData.appliances, label: 'Garbage Disposal' },
//                           { key: 'others' as keyof typeof formData.appliances, label: 'Others' }
//                         ].map(item => (
//                           <div key={item.key} className="flex items-center space-x-2">
//                             <input
//                               type="checkbox"
//                               id={item.key}
//                               checked={formData.appliances[item.key]}
//                               onChange={(e) => updateNestedFormData('appliances', item.key, e.target.checked)}
//                               className="w-4 h-4 text-orange-600 rounded"
//                             />
//                             <label htmlFor={item.key} className="text-sm text-gray-700">{item.label}</label>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Landlord Languages */}
//                     <div className="border border-gray-200 rounded-lg p-4">
//                       <h3 className="font-medium text-gray-900 mb-2">Landlord Languages</h3>
//                       <p className="text-sm text-gray-600 mb-4">Languages spoken by the landlord/property management</p>
                      
//                       <div className="grid grid-cols-2 gap-3 mb-4">
//                         {[
//                           { key: 'english' as keyof typeof formData.landlordLanguages, label: 'English' },
//                           { key: 'estonian' as keyof typeof formData.landlordLanguages, label: 'Estonian' },
//                           { key: 'spanish' as keyof typeof formData.landlordLanguages, label: 'Spanish' },
//                           { key: 'french' as keyof typeof formData.landlordLanguages, label: 'French' },
//                           { key: 'italian' as keyof typeof formData.landlordLanguages, label: 'Italian' },
//                           { key: 'german' as keyof typeof formData.landlordLanguages, label: 'German' }
//                         ].map(item => (
//                           <div key={item.key} className="flex items-center space-x-2">
//                             <input
//                               type="checkbox"
//                               id={item.key}
//                               checked={formData.landlordLanguages[item.key]}
//                               onChange={(e) => updateNestedFormData('landlordLanguages', item.key, e.target.checked)}
//                               className="w-4 h-4 text-orange-600 rounded"
//                             />
//                             <label htmlFor={item.key} className="text-sm text-gray-700">{item.label}</label>
//                           </div>
//                         ))}
//                       </div>
                      
//                       <div className="flex items-center space-x-2">
//                         <input
//                           type="checkbox"
//                           id="othersLang"
//                           checked={formData.landlordLanguages.others}
//                           onChange={(e) => updateNestedFormData('landlordLanguages', 'others', e.target.checked)}
//                           className="w-4 h-4  text-orange-600 rounded" />
//                         <label htmlFor="othersLang" className="text-sm text-gray-700">Others</label>
//                       </div>

//                       {formData.landlordLanguages.others && (
//                         <input
//                           type="text"
//                           placeholder="Specify other languages"
//                           value={formData.landlordLanguages.otherText || ''}
//                           onChange={(e) =>
//                             updateNestedFormData('landlordLanguages', 'otherText', e.target.value)
//                           }
//                           className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
//                         />
//                       )}
//                     </div>
//                     {/* Building Facilities */}
//                     <div className="border border-gray-200 rounded-lg p-4">
//                       <h3 className="font-medium text-gray-900 mb-2">Building Facilities</h3>
//                       <p className="text-sm text-gray-600 mb-4">Select all facilities available in the building</p>
                      
//                       <div className="grid grid-cols-2 gap-3">
//                         {[
//                           { key: 'parkingLot' as keyof typeof formData.buildingFacilities, label: 'Parking Lot' },
//                           { key: 'streetParking' as keyof typeof formData.buildingFacilities, label: 'Street Parking' },
//                           { key: 'gymFitness' as keyof typeof formData.buildingFacilities, label: 'Gym/Fitness' },
//                           { key: 'elevator' as keyof typeof formData.buildingFacilities, label: 'Elevator' },
//                           { key: 'storageSpace' as keyof typeof formData.buildingFacilities, label: 'Storage Space' },
//                           { key: 'childrenPlayArea' as keyof typeof formData.buildingFacilities, label: 'Children Play Area' },
//                           { key: 'roofTerrace' as keyof typeof formData.buildingFacilities, label: 'Roof Terrace' },
//                           { key: 'securitySystem' as keyof typeof formData.buildingFacilities, label: 'Security System' },
//                           { key: 'dedicatedParking' as keyof typeof formData.buildingFacilities, label: 'Dedicated Parking' },
//                           { key: 'swimmingPool' as keyof typeof formData.buildingFacilities, label: 'Swimming Pool' },
//                           { key: 'gardenCourtyard' as keyof typeof formData.buildingFacilities, label: 'Garden/Courtyard' },
//                           { key: 'others' as keyof typeof formData.buildingFacilities, label: 'Others' }
//                         ].map(item => (
//                           <div key={item.key} className="flex items-center space-x-2">
//                             <input
//                               type="checkbox"
//                               id={item.key}
//                               checked={formData.buildingFacilities[item.key]}
//                               onChange={(e) => updateNestedFormData('buildingFacilities', item.key, e.target.checked)}
//                               className="w-4 h-4 text-orange-600 rounded"
//                             />
//                             <label htmlFor={item.key} className="text-sm text-gray-700">{item.label}</label>
//                           </div>
//                         ))}
//                       </div>
//                       {formData.buildingFacilities.others && (
//                         <input
//                           type="text"
//                           placeholder="Specify other facilities"
//                           value={formData.buildingFacilities.otherText || ''}
//                           onChange={(e) =>
//                             updateNestedFormData('buildingFacilities', 'otherText', e.target.value)
//                           }
//                           className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
//                         />
//                       )}
//                     </div>
//                     {/* Nearest Grocery Store */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Nearest Grocery Store</label>
//                       <input
//                         type="text"
//                         placeholder="e.g. SuperMart"
//                         value={formData.nearestGroceryStore}
//                         onChange={(e) => updateFormData('nearestGroceryStore', e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                       />     
//                     </div>
//                     {/* Nearest Public Transport */}
//                     <div>   
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Nearest Public Transport</label>
//                       <input
//                         type="text"
//                         placeholder="e.g. Bus Stop, Metro Station"
//                         value={formData.nearestPublicTransport}
//                         onChange={(e) => updateFormData('nearestPublicTransport', e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               )}
//               {/* Step 2C: Ratings & Reviews */}
//               {currentSubStep === 3 && (
//                 <div>
//                   <div className="mb-6">
//                     <h2 className="text-xl font-semibold text-gray-900 mb-2">{getCurrentSubStepTitle()}</h2>
//                     <p className="text-gray-600">Rate your experience with this property</p>
//                   </div>

//                   <div className="space-y-6">
//                     {/* Rating Component */}
                    // <RatingComponent
                    //   label="Overall Experience"
                    //   onSubmit={handleSubmit}
                    //   rating={formData.overallExperience}
                    //   onRatingChange={(value: any) => updateFormData('overallExperience', value)}
                    // />
                    
//                     {/* Additional Comments */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Additional Comments</label>
//                       <textarea
//                         placeholder="Share your thoughts about the property"
//                         value={formData.additionalComments || ''}
//                         onChange={(e) => updateFormData('additionalComments', e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent h-24 resize-none"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               )}
//           </div>
//           )}

//           {/* Step 3: Submit Review */}
//           {currentStep === 3 && (
//         <SubmitReviewComponent
//           onTermsChange={handleTermsChange}
//           isSubmitting={isSubmitting}
//         />
//           )}
//         </div>  
//          <div className="flex justify-between mt-8">         
//         <button
//           onClick={prevStep}
//           disabled={currentStep === 1 && currentSubStep === 1}
//           className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <button
//           onClick={nextStep}
//           disabled={currentStep === 3 && (!canSubmit || isSubmitting)}
//           className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {currentStep === 3 
//             ? (isSubmitting ? 'Submitting...' : 'Submit Review')
//             : 'Continue'
//           }
//         </button>   
//       </div>
//       </main>
//     </div>
//   );
// }      



"use client";



import React, { useRef, useState, useEffect } from 'react';
import { ChevronDown, Calendar, Home, Star, MessageSquare } from 'lucide-react';
import RatingComponent from '@/components/molecules/ReviewsRating';
import SubmitReviewComponent from '@/components/organisms/SubmitReviews';
import LocationForm from '../molecules/LocationForm';
import { useAuthRedirect } from '@/Hooks/useAuthRedirect';
import { useWriteReviewMutation } from '@/Hooks/use.writeReviews.mutation';
import { useRouter } from 'next/navigation';

export const WritePropertyReview = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const submitReviewRef = useRef(null);
  const [currentSubStep, setCurrentSubStep] = useState(1);
  
  // Mutations and Auth
  const writeReviewMutation = useWriteReviewMutation();
  const {
    isAuthenticated,
    isLoading: authLoading,
    hasPendingData,
    pendingReviewData,
    handleAuthRedirect,
    handlePostLoginRedirect,
    clearPendingData,
    submitPendingReview,
    checkAuthentication
  } = useAuthRedirect(writeReviewMutation);
   const router = useRouter();

  const [formData, setFormData] = useState({
    // Step 1 - Property Details
    country: '',
    address: '',
    apartmentNumber: '',
    numberOfRooms: '',
    numberOfOccupants: '',
    moveOutDate: 'May 2025',
    additionalComments: '',
    propertyCondition: 0,
    landlordResponsiveness: 0,
    reviewText: '',
    
    // Accessibility Features
    accessibilityFeatures: {
      wheelchairAccessible: false,
      elevator: false,
      brailleSigns: false,
      audioAssistance: false
    },
    
    // Step 2A - Cost Details
    nearestPublicTransport: '',
    rentType: 'actual', // 'actual' or 'range'
    yearlyRent: 'NGN300,000',
    securityDepositRequired: false,
    agentFeeRequired: false,
    fixedUtilityCost: false,
    centralHeating: false,
    furnished: false,
    julyUtilities: '',
    januaryUtilities: '',
    
    // Step 2B - Amenities & Accessibility
    appliances: {
      oven: false,
      washingMachine: false,
      refrigerator: false,
      garbageDisposal: false,
      airConditioner: false,
      dryer: false,
      microwave: false,
      others: false
    },
    landlordLanguages: {
      english: false,
      french: false,
      estonian: false,
      italian: false,
      spanish: false,
      german: false,
      others: false,
      customLanguage: false,
      otherText: '',
      customLanguageText: ''
    },
    buildingFacilities: {
      parkingLot: false as boolean,
      streetParking: false as boolean,
      gymFitness: false as boolean,
      elevator: false as boolean,
      storageSpace: false as boolean,
      childrenPlayArea: false as boolean,
      roofTerrace: false as boolean,
      securitySystem: false as boolean,
      dedicatedParking: false as boolean,
      swimmingPool: false as boolean,
      gardenCourtyard: false as boolean,
      others: false as boolean,
      otherText: '' as string
    },
    nearestGroceryStore: '',
    nearestPark: '',
    
    // Step 2C - Ratings & Reviews
    valueForMoney: 0,
    costOfRepairs: '', // 'tenant', 'landlord', 'split', 'depends'
    overallExperience: 0,
    detailedReview: '',
    
    // Step 3 - Submit Review
    submitAnonymously: false,
    agreeToTerms: false
  });

  // Handle pending data restoration when user returns after login
  useEffect(() => {
    if (isAuthenticated && hasPendingData && pendingReviewData) {
      console.log('Restoring form data after login:', pendingReviewData);
      
      // Restore the form data from localStorage
      setFormData(prevData => ({
        ...prevData,
        ...pendingReviewData.stayDetails,
        ...pendingReviewData.costDetails,
        ...pendingReviewData.accessibility,
        ...pendingReviewData.ratingsAndReviews,
        submitAnonymously: pendingReviewData.submitAnonymously
      }));

      // Navigate to the submit step
      setCurrentStep(3);
      setCanSubmit(true);

      // Optionally show a success message
      console.log('Form data restored successfully');
    }
  }, [isAuthenticated, hasPendingData, pendingReviewData]);

  // Handle authenticated user with pending data on mount
  useEffect(() => {
    if (isAuthenticated && hasPendingData && pendingReviewData) {
      handlePostLoginRedirect();
    }
  }, [isAuthenticated, hasPendingData]);

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  type FormDataCategory = keyof typeof formData;
  
  const updateNestedFormData = (category: FormDataCategory, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...(typeof prev[category] === 'object' ? prev[category] : {}),
        [field]: value
      }
    }));
  };

  const nextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      setCurrentSubStep(1);
    } else if (currentStep === 2) {
      if (currentSubStep < 3) {
        setCurrentSubStep(currentSubStep + 1);
      } else {
        setCurrentStep(3);
      }
    }
  };

  const prevStep = () => {
    if (currentStep === 3) {
      setCurrentStep(2);
      setCurrentSubStep(3);
    } else if (currentStep === 2) {
      if (currentSubStep > 1) {
        setCurrentSubStep(currentSubStep - 1);
      } else {
        setCurrentStep(1);
      }
    }
  };

  // Transform form data to match API format
  const transformFormDataToAPI = (data: typeof formData) => {
    // Get selected appliances
    const selectedAppliances = Object.entries(data.appliances)
      .filter(([key, value]) => value && key !== 'others')
      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));

    // Get selected building facilities
    const selectedFacilities = Object.entries(data.buildingFacilities)
      .filter(([key, value]) => value && key !== 'others')
      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));

    // Get selected landlord languages
    const selectedLanguages = Object.entries(data.landlordLanguages)
      .filter(([key, value]) => value && key !== 'others' && key !== 'customLanguage' && key !== 'otherText')
      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));

    return {
      location: {
        country: data.country,
        city: "", // You'll need to add this to your form
        district: "", // You'll need to add this to your form
        zipCode: "", // You'll need to add this to your form
        streetAddress: data.address
      },
      stayDetails: {
        numberOfRooms: parseInt(data.numberOfRooms) || 0,
        numberOfOccupants: parseInt(data.numberOfOccupants) || 0,
        dateLeft: new Date(data.moveOutDate).toISOString(),
        furnished: data.furnished,
        appliancesFixtures: selectedAppliances,
        buildingFacilities: selectedFacilities,
        landlordLanguages: selectedLanguages
      },
      costDetails: {
        rent: parseFloat(data.yearlyRent.replace(/[^\d.]/g, '')) || 0,
        rentType: data.rentType === 'actual' ? 'Yearly' : 'Range',
        securityDepositRequired: data.securityDepositRequired,
        agentBrokerFeeRequired: data.agentFeeRequired,
        fixedUtilityCost: data.fixedUtilityCost,
        julySummerUtilities: parseFloat(data.julyUtilities.replace(/[^\d.]/g, '')) || 0,
        januaryWinterUtilities: parseFloat(data.januaryUtilities.replace(/[^\d.]/g, '')) || 0
      },
      accessibility: {
        nearestGroceryStore: data.nearestGroceryStore || "Not specified",
        nearestPark: data.nearestPark || "Not specified",
        nearestRestaurant: data.nearestPublicTransport || "Not specified"
      },
      ratingsAndReviews: {
        valueForMoney: data.valueForMoney,
        costOfRepairsCoverage: data.costOfRepairs || "Not specified",
        overallExperience: data.overallExperience,
        overallRating: (data.valueForMoney + data.overallExperience) / 2,
        detailedReview: data.detailedReview || data.additionalComments || "No detailed review provided"
      },
      submitAnonymously: data.submitAnonymously
    };
  };

  const handleFinalSubmit = async () => {
    if (!canSubmit) {
      alert('Please agree to the terms and conditions to continue');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Transform form data to API format
      const apiData = transformFormDataToAPI(formData);
      
      // Check if user is authenticated
      if (!isAuthenticated) {
        console.log('User not authenticated, redirecting to signin...');
        
        // Create the pending review data structure
        const pendingReviewData = {
          stayDetails: apiData.stayDetails,
          costDetails: apiData.costDetails,
          accessibility: apiData.accessibility,
          ratingsAndReviews: apiData.ratingsAndReviews,
          submitAnonymously: apiData.submitAnonymously
        };

        // Store data and redirect to signin
        handleAuthRedirect(pendingReviewData);
        return;
      }

      // User is authenticated, submit the review directly
      console.log('Submitting review for authenticated user...', apiData);
      
      await writeReviewMutation.mutate(apiData);
      
      console.log('Review submitted successfully!');
      
      // Clear any pending data
      clearPendingData();
      
      // Show success message or redirect
      alert('Review submitted successfully!');
      
      // Optionally redirect to a success page or reset form
      // router.push('/reviews/success');
      
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('There was an error submitting your review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTermsChange = (agreed: boolean | ((prevState: boolean) => boolean)) => {
    const newValue = typeof agreed === 'function' ? agreed(canSubmit) : agreed;
    setCanSubmit(newValue);
    updateFormData('agreeToTerms', newValue);
  };

  // Handle submission of pending review after successful login
  useEffect(() => {
    const handlePendingSubmission = async () => {
      if (isAuthenticated && hasPendingData && pendingReviewData && canSubmit) {
        try {
          console.log('Auto-submitting pending review after login...');
          await submitPendingReview(pendingReviewData);
          alert('Review submitted successfully!');
          
          // Reset form or redirect as needed
          // router.push('/reviews/success');
          
        } catch (error) {
          console.error('Error auto-submitting pending review:', error);
          alert('There was an error submitting your review. Please try again.');
        }
      }
    };

    // Add a small delay to ensure all state updates are complete
    const timeoutId = setTimeout(handlePendingSubmission, 100);
    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, hasPendingData, pendingReviewData, canSubmit, submitPendingReview]);

  const StarRating = ({ rating, onRatingChange, label }: { rating: number, onRatingChange: (rating: number) => void, label: string }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 cursor-pointer transition-colors ${
              star <= rating ? 'fill-orange-400 text-orange-400' : 'text-gray-300'
            }`}
            onClick={() => onRatingChange(star)}
          />
        ))}
      </div>
    </div>
  );

  const getCurrentStepTitle = () => {
    if (currentStep === 1) return "Property Details";
    if (currentStep === 2) return "Experience and Ratings";
    if (currentStep === 3) return "Submit Review";
    return "";
  };

  const getCurrentSubStepTitle = () => {
    if (currentStep === 2) {
      if (currentSubStep === 1) return "Cost Details";
      if (currentSubStep === 2) return "Amenities & Accessibility";
      if (currentSubStep === 3) return "Ratings & Reviews";
    }
    return "";
  };

  const getCurrentStepMessage = () => {
    if (currentStep === 1) return "Let's start your property review journey! Tell us about your place.";
    if (currentStep === 2 && currentSubStep === 1) return "You're doing great! Now let's dive into your experience.";
    if (currentStep === 2 && currentSubStep === 2) return "Tell us about the property's amenities and location";
    if (currentStep === 2 && currentSubStep === 3) return "Rate your experience with this property";
    if (currentStep === 3) return "Almost there! Just a few more details and you're done";
    return "";
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Review submitted successfully!');
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Show restoration message if data was restored */}
      {hasPendingData && isAuthenticated && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mx-4 mt-4">
          <p className="text-green-700 text-sm flex items-center">
            <span className="mr-2">✓</span>
            Welcome back! Your review data has been restored.
          </p>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-teal-700 mb-2">Write a Property Review</h1>
          <p className="text-gray-600">Share your honest opinion about a property to help others make informed decisions.</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-orange-100 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {currentStep > 1 ? '✓' : '1'}
              </div>
              <span className="text-sm font-medium">Property Details</span>
            </div>
            <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {currentStep > 2 ? '✓' : '2'}
              </div>
              <span className="text-sm font-medium">Experience and Ratings</span>
            </div>
            <div className={`flex items-center space-x-2 ${currentStep >= 3 ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 3 ? 'bg-orange-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                3
              </div>
              <span className="text-sm font-medium">Submit Review</span>
            </div>
          </div>
        </div>

        {/* Progress Message */}
        {currentStep === 2 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-700 text-sm flex items-center">
              <span className="mr-2">👋</span>
              {getCurrentStepMessage()}
            </p>
          </div>
        )}

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Step 1: Property Details */}
          {currentStep === 1 && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{getCurrentStepTitle()}</h2>
                <p className="text-gray-600 flex items-center">
                  <Home className="w-4 h-4 mr-1" />
                  {getCurrentStepMessage()}
                </p>
              </div>

              <div className="space-y-6">
                {/* Location */}
                <LocationForm/>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address <span className="text-gray-400 text-xs ml-1">ⓘ</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Billing Address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={formData.address}
                    onChange={(e) => updateFormData('address', e.target.value)}
                  />
                </div>

                {/* Apartment/Unit Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Apartment/Unit Number</label>
                  <input
                    type="text"
                    placeholder="enter Apartment/Unit Number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={formData.apartmentNumber}
                    onChange={(e) => updateFormData('apartmentNumber', e.target.value)}
                  />
                </div>

                {/* Number of Rooms and Occupants */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Rooms</label>
                    <input
                      type="text"
                      placeholder="e.g. 2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      value={formData.numberOfRooms}
                      onChange={(e) => updateFormData('numberOfRooms', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Occupants</label>
                    <input
                      type="text"
                      placeholder="e.g. 4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      value={formData.numberOfOccupants}
                      onChange={(e) => updateFormData('numberOfOccupants', e.target.value)}
                    />
                  </div>
                </div>

                {/* Move Out Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">When did you leave this property?</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.moveOutDate}
                      onChange={(e) => updateFormData('moveOutDate', e.target.value)}
                      className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Experience and Ratings */}
          {currentStep === 2 && (
            <div>
              {/* Step 2A: Cost Details */}
              {currentSubStep === 1 && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{getCurrentSubStepTitle()}</h2>
                    <p className="text-gray-600">Tell us about the rental costs</p>
                  </div>

                  <div className="space-y-6">
                    {/* Rent */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">Rent</h3>
                      <p className="text-sm text-gray-600 mb-4">Enter your yearly rent amount</p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="actual"
                            name="rentType"
                            checked={formData.rentType === 'actual'}
                            onChange={() => updateFormData('rentType', 'actual')}
                            className="w-4 h-4 text-orange-600"
                          />
                          <label htmlFor="actual" className="text-sm text-gray-700">Actual amount</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="range"
                            name="rentType"
                            checked={formData.rentType === 'range'}
                            onChange={() => updateFormData('rentType', 'range')}
                            className="w-4 h-4 text-orange-600"
                          />
                          <label htmlFor="range" className="text-sm text-gray-700">Range</label>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Yearly Rent</label>
                        <input
                          type="text"
                          value={formData.yearlyRent}
                          onChange={(e) => updateFormData('yearlyRent', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Security Deposit */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">Security Deposit</h3>
                      <p className="text-sm text-gray-600 mb-4">Information about your security deposit</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Was a security deposit required?</span>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                          <input
                            type="checkbox"
                            checked={formData.securityDepositRequired}
                            onChange={(e) => updateFormData('securityDepositRequired', e.target.checked)}
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                          />
                          <label className={`toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${formData.securityDepositRequired ? 'bg-orange-500' : ''}`}></label>
                        </div>
                      </div>
                    </div>

                    {/* Agent/Broker Fees */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">Agent/Broker Fees</h3>
                      <p className="text-sm text-gray-600 mb-4">Information about any agent or broker fees</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Was an agent/broker fee required?</span>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                          <input
                            type="checkbox"
                            checked={formData.agentFeeRequired}
                            onChange={(e) => updateFormData('agentFeeRequired', e.target.checked)}
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                          />
                          <label className={`toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${formData.agentFeeRequired ? 'bg-orange-500' : ''}`}></label>
                        </div>
                      </div>
                    </div>

                    {/* Utilities & Amenities */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-4">Utilities & Amenities</h3>
                      <p className="text-sm text-gray-600 mb-4">Tell us about the utilities and features</p>
                      
                      <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                        <h4 className="font-medium text-gray-900">Utilities</h4>
                        <p className="text-sm text-gray-600">Information about utility costs and features</p>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Fixed utility cost</span>
                            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                              <input
                                type="checkbox"
                                checked={formData.fixedUtilityCost}
                                onChange={(e) => updateFormData('fixedUtilityCost', e.target.checked)}
                                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                              />
                              <label className={`toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${formData.fixedUtilityCost ? 'bg-orange-500' : ''}`}></label>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Central Heating</span>
                            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                              <input
                                type="checkbox"
                                checked={formData.centralHeating}
                                onChange={(e) => updateFormData('centralHeating', e.target.checked)}
                                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                              />
                              <label className={`toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${formData.centralHeating ? 'bg-orange-500' : ''}`}></label>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Furnished</span>
                            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                              <input
                                type="checkbox"
                                checked={formData.furnished}
                                onChange={(e) => updateFormData('furnished', e.target.checked)}
                                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance
                                -none cursor-pointer"
                              />
                              <label className={`toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${formData.furnished ? 'bg-orange-500' : ''}`}></label>
                            </div>
                          </div>      

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">July Utilities</label>
                            <input
                              type="text"
                              placeholder="e.g. NGN 10,000"
                              value={formData.julyUtilities}
                              onChange={(e) => updateFormData('julyUtilities', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />    
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">January Utilities</label>
                            <input
                              type="text"
                              placeholder="e.g. NGN 8,000"
                              value={formData.januaryUtilities}
                              onChange={(e) => updateFormData('januaryUtilities', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                      {/* Nearest Public Transport */}
                      <div className="mt-6">      
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nearest Public Transport</label>
                        <input
                          type="text"
                          placeholder="e.g. Bus Stop, Train Station"
                          value={formData.nearestPublicTransport}
                          onChange={(e) => updateFormData('nearestPublicTransport', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>  
                </div>
              )}
              {/* Step 2B: Amenities & Accessibility */}
              {currentSubStep === 2 && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{getCurrentSubStepTitle()}</h2>
                    <p className="text-gray-600">Tell us about the property's amenities and location</p>
                  </div>

                  <div className="space-y-6">
                    {/* Appliances */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">Appliances & Fixtures</h3>
                      <p className="text-sm text-gray-600 mb-4">Select the appliances available in the property</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {['oven', 'washingMachine', 'refrigerator', 'garbageDisposal', 'airConditioner', 'dryer', 'microwave'].map((appliance) => (
                          <div key={appliance} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={appliance}
                              checked={formData.appliances[appliance as keyof typeof formData.appliances]}
                              onChange={(e) => updateNestedFormData('appliances', appliance, e.target.checked)}
                              className="w-4 h-4 text-orange-600"
                            />
                            <label htmlFor={appliance} className="text-sm text-gray-700 capitalize">{appliance.replace(/([A-Z])/g, ' $1')}</label>
                          </div>
                        ))}
                        {/* Other Appliances */}
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="others"
                            checked={formData.appliances.others}
                            onChange={(e) => updateNestedFormData('appliances', 'others', e.target.checked)}
                            className="w-4 h-4 text-orange-600"
                          />
                          <label htmlFor="others" className="text-sm text-gray-700">Others</label>
                        </div>
                      </div>
                    </div>

                    {/* Landlord Languages */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900
 mb-2">Landlord Languages</h3>    
                      <p className="text-sm text-gray-600 mb-4">Select the languages spoken by the landlord</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {['english', 'french', 'spanish', 'german', 'chinese'].map((language) => (
                          <div key={language} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={language}
                              checked={formData.landlordLanguages[language as keyof typeof formData.landlordLanguages]}
                              onChange={(e) => updateNestedFormData('landlordLanguages', language, e.target.checked)}
                              className="w-4 h-4 text-orange-600"
                            />
                            <label htmlFor={language} className="text-sm text-gray-700 capitalize">{language}</label>
                          </div>
                        ))}
                        {/* Custom Language */}
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="customLanguage"
                            checked={formData.landlordLanguages.customLanguage}
                            onChange={(e) => updateNestedFormData('landlordLanguages', 'customLanguage', e.target.checked)}
                            className="w-4 h-4 text-orange-600"
                          />
                          <label htmlFor="customLanguage" className="text-sm text-gray-700">Custom Language</label>
                        </div>
                        {/* Other Languages */}
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="others"
                            checked={formData.landlordLanguages.others}
                            onChange={(e) => updateNestedFormData('landlordLanguages', 'others', e.target.checked)}
                            className="w-4 h-4 text-orange-600"
                          />
                          <label htmlFor="others" className="text-sm text-gray-700">Others</label>
                        </div>
                      </div>

                      {/* Other Language Text Input */}
                      {formData.landlordLanguages.others && (
                        <div className="mt-4">
                          <label htmlFor="otherText" className="block text-sm font-medium text-gray-700 mb-2">Other Language</label>
                          <input
                            type="text"
                            id="otherText"      
                            placeholder="Enter other language"
                            value={formData.landlordLanguages.otherText}
                            onChange={(e) => updateNestedFormData('landlordLanguages', 'otherText', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        </div>
                      )}
                    </div>
                    {/* Accessibility */}
                    <div className="border border-gray-200 rounded-lg p-4">   
                      <h3 className="font-medium text-gray-900 mb-2">Accessibility</h3>
                      <p className="text-sm text-gray-600 mb-4">Information about the property's accessibility features</p>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Nearest Grocery Store</label>
                          <input
                            type="text"
                            placeholder="e.g. Supermarket, Local Store"
                            value={formData.nearestGroceryStore}
                            onChange={(e) => updateFormData('nearestGroceryStore', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Nearest Park</label>
                          <input
                            type="text"
                            placeholder="e.g. City Park, Community Garden"
                            value={formData.nearestPark}
                            onChange={(e) => updateFormData('nearestPark', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Nearest Public Transport</label>
                          <input
                            type="text"
                            placeholder="e.g. Bus Stop, Train Station"
                            value={formData.nearestPublicTransport}
                            onChange={(e) => updateFormData('nearestPublicTransport', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        </div>
                      </div>      
                    </div>
                    {/* Accessibility Features */}
                    <div className="border border-gray-200 rounded-lg p-4"> 
                      <h3 className="font-medium text-gray-900 mb-2">Accessibility Features</h3>
                      <p className="text-sm text-gray-600 mb-4">Select the accessibility features available in the property</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {['wheelchairAccessible', 'elevator', 'brailleSigns', 'audioAssistance'].map((feature) => (
                          <div key={feature} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={feature}
                              checked={formData.accessibilityFeatures[feature as keyof typeof formData.accessibilityFeatures]}
                              onChange={(e) => updateNestedFormData('accessibilityFeatures', feature, e.target.checked)}
                              className="w-4 h-4 text-orange-600"
                            />
                            <label htmlFor={feature} className="text-sm text-gray-700 capitalize">{feature.replace(/([A-Z])/g, ' $1')}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Step 2C: Ratings & Reviews */}
              {currentSubStep === 3 && (  
                // <div>
                //   <div className="mb-6">
                //     <h2 className="text-xl font-semibold text-gray-900 mb-2">{getCurrentSubStepTitle()}</h2>
                //     <p className="text-gray-600">Rate your experience with this property</p>
                //   </div>

                //   <div className="space-y-6">
                //     {/* Star Ratings */}
                //     <div className="space-y-4">
                //       <StarRating
                //         rating={formData.overallExperience}
                //         onRatingChange={(rating) => updateFormData('overallExperience', rating)}
                //         label="Overall Experience"
                //       />
                //       <StarRating
                //         rating={formData.landlordResponsiveness}
                //         onRatingChange={(rating) => updateFormData('landlordResponsiveness', rating)}
                //         label="Landlord Responsiveness"
                //       />
                //       <StarRating
                //         rating={formData.propertyCondition}
                //         onRatingChange={(rating) => updateFormData('propertyCondition', rating)}
                //         label="Property Condition"
                //       />
                //       <StarRating
                //         rating={formData.valueForMoney}
                //         onRatingChange={(rating) => updateFormData('valueForMoney', rating)}
                //         label="Value for Money"
                //       />
                //     </div>

                //     {/* Review Text */}
                //     <div>
                //       <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                //       <textarea
                //         rows={4}
                //         placeholder="Write your review here..."
                //         value={formData.reviewText}
                //         onChange={(e) => updateFormData('reviewText', e.target.value)}
                //         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                //       ></textarea>
                //     </div>
                //   </div>
                // </div>


                <RatingComponent
                label="Overall Experience"
                onSubmit={handleSubmit}
                rating={formData.overallExperience}
                onRatingChange={(value: any) => updateFormData('overallExperience', value)}
              />
              )}
          </div>
          )}

          {/* Step 3: Submit Review */}
          {currentStep === 3 && (
            <SubmitReviewComponent/>
          )}

          {/* Navigation Buttons */}    
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200"
              >
                Previous
              </button>
            )}
            {currentStep < 3 && (
              <button
                onClick={nextStep}
                className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition duration-200"
              >
                Continue
              </button>
            )}
            {currentStep === 3 && (
              <button
                onClick={handleSubmit}
                className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition duration-200"
              >
                Submit Review
              </button>
            )}
          </div>
        </div>
        </main>
      </div>

    
  );
}

