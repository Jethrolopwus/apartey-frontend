import { 
  PropertyListingFormState, 
  PropertyListingPayload,
  CategoryType,
  Currency,
  OfferType,
  PromotionTier,
  Amenity,
  Infrastructure,
  QuickSelect,
  MediaUpload
} from '@/types/propertyListing';

/**
 * Transforms step-by-step form data into backend payload structure
 * This ensures the data matches the Mongoose schema exactly
 */
export function transformFormDataToPayload(formData: PropertyListingFormState): PropertyListingPayload {
  // Transform price data based on category
  const transformPriceData = () => {
    const price = parseFloat(formData.price || '0');
    const currency = formData.currency || 'EUR';
    
    switch (formData.category) {
      case 'Sale':
        return {
          salePrice: { salePrice: price }
        };
      case 'Rent':
        const monthlyPrice = formData.rentType === 'Yearly' ? price / 12 : price;
        const yearlyPrice = formData.rentType === 'Yearly' ? price : price * 12;
        return {
          rent: {
            monthly: monthlyPrice,
            yearly: yearlyPrice
          }
        };
      case 'Swap':
        const swapMonthlyPrice = formData.rentType === 'Yearly' ? price / 12 : price;
        const swapYearlyPrice = formData.rentType === 'Yearly' ? price : price * 12;
        return {
          swap: {
            monthly: swapMonthlyPrice,
            yearly: swapYearlyPrice
          }
        };
      default:
        return {
          rent: {
            monthly: price,
            yearly: price * 12
          }
        };
    }
  };

  // Transform property details
  const transformPropertyDetails = () => {
    const priceData = transformPriceData();
    return {
      price: {
        ...priceData,
        currency: formData.currency || 'EUR'
      },
      negotiatedPrice: formData.isNegotiated || false,
      notForCreditSale: formData.notForCreditSale || false,
      readyToCooperateWithAgents: formData.readyToCooperateWithAgents || false,
      possibleExchange: formData.possibleExchange || false,
      totalFloors: formData.propertyDetails?.totalFloors ? parseInt(formData.propertyDetails.totalFloors) : undefined,
      floor: formData.propertyDetails?.floor ? parseInt(formData.propertyDetails.floor) : undefined,
      totalAreaSqM: formData.propertyDetails?.totalAreaSqM ? parseFloat(formData.propertyDetails.totalAreaSqM) : undefined,
      livingAreaSqM: formData.propertyDetails?.livingAreaSqM ? parseFloat(formData.propertyDetails.livingAreaSqM) : undefined,
      kitchenAreaSqM: formData.propertyDetails?.bedroomAreaSqM ? parseFloat(formData.propertyDetails.bedroomAreaSqM) : undefined,
      livingrooms: formData.propertyDetails?.livingRooms || undefined,
      bedrooms: formData.propertyDetails?.bedrooms || undefined,
      bathrooms: formData.propertyDetails?.bathrooms || undefined,
      parkingSpots: formData.propertyDetails?.parkingSpots || undefined,
      amenities: (formData.propertyDetails?.amenities || []) as Amenity[],
      infrastructure: (formData.propertyDetails?.infrastructure || []) as Infrastructure[],
      description: formData.propertyDetails?.description || ''
    };
  };

  // Transform location data
  const transformLocationData = () => {
    return {
      country: formData.country || '',
      countryCode: formData.countryCode || '',
      stateOrRegion: formData.state || '',
      district: formData.district || undefined,
      street: formData.streetAddress || '',
      streetNumber: undefined, // Not collected in form
      apartment: formData.apartment || '',
      postalCode: formData.zipCode || undefined,
      fullAddress: formData.searchAddress || '',
      coordinates: formData.location?.coordinates,
      displayOnMap: true
    };
  };

  // Transform media data
  const transformMediaData = () => {
    return {
      coverPhoto: typeof formData.coverPhoto === 'string' ? formData.coverPhoto : '',
      uploads: [], // Will be handled by the createFormDataPayload function
      videoTourLink: formData.videoTourLink
    };
  };

  // Transform listing duration (only for Swap category)
  const transformListingDuration = () => {
    if (formData.category !== 'Swap') return undefined;
    
    // Get the listing duration object
    const listingDuration = formData.propertyDetails?.listingDuration;
    if (!listingDuration) return undefined;

    // Handle both object and string formats
    if (typeof listingDuration === 'object' && listingDuration !== null) {
      // If it's an object with startDate, endDate, quickSelect
      const durationObj = listingDuration as { startDate?: string; endDate?: string; quickSelect?: string };
      return {
        startDate: durationObj.startDate ? new Date(durationObj.startDate) : new Date(),
        endDate: durationObj.endDate ? new Date(durationObj.endDate) : undefined,
        quickSelect: durationObj.quickSelect as QuickSelect
      };
    } else if (typeof listingDuration === 'string') {
      // If it's a string (legacy format), parse it
      const startDate = new Date();
      const quickSelect = listingDuration.includes('1 Month') ? '1 Month' as QuickSelect :
                         listingDuration.includes('3 Months') ? '3 Months' as QuickSelect :
                         listingDuration.includes('6 Months') ? '6 Months' as QuickSelect :
                         listingDuration.includes('1 Year') ? '1 Year' as QuickSelect : undefined;

      return {
        startDate,
        quickSelect
      };
    }

    return undefined;
  };

  // Transform contact info
  const transformContactInfo = () => {
    return {
      typeOfOffer: formData.offerType || 'private',
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      email: formData.email || '',
      phoneNumber: formData.phoneNumber,
      openForTourSchedule: formData.openForTourSchedule || false
    };
  };

  // Transform ad promotion
  const transformAdPromotion = () => {
    if (!formData.selectedTier) return undefined;

    return {
      selectedTier: formData.selectedTier,
      promotionStartDate: formData.promotionStartDate,
      promotionEndDate: formData.promotionEndDate,
      certifiedByFinder: formData.certifiedByFinder || false,
      liftsToTopCount: formData.liftsToTopCount || 0,
      detailedAnalytics: formData.detailedAnalytics || false,
      promotionPrice: formData.promotionPrice,
      currency: formData.promotionCurrency
    };
  };

  // Build the complete payload
  const payload: PropertyListingPayload = {
    // Basic Info
    category: formData.category || 'Rent',
    propertyType: formData.propertyType || 'Apartment',
    condition: formData.condition || 'Good Condition',
    petPolicy: formData.petPolicy || 'pet-friendly',

    // Location
    location: transformLocationData(),

    // Media
    media: transformMediaData(),

    // Property Details
    propertyDetails: transformPropertyDetails(),

    // Listing Duration (only for Swap category)
    listingDuration: transformListingDuration(),

    // Contact Info
    contactInfo: transformContactInfo(),

    // Ad Promotion
    adPromotion: transformAdPromotion(),

    // Status
    isAvailable: true,
    status: 'pending',
    views: 0
  };

  return payload;
}

/**
 * Validates the form data before submission
 */
export function validateFormData(formData: PropertyListingFormState): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields validation
  if (!formData.category) errors.push('Category is required');
  if (!formData.propertyType) errors.push('Property type is required');
  if (!formData.condition) errors.push('Property condition is required');
  if (!formData.petPolicy) errors.push('Pet policy is required');

  // Location validation
  if (!formData.country) errors.push('Country is required');
  if (!formData.city) errors.push('City is required');
  if (!formData.streetAddress) errors.push('Street address is required');
  if (!formData.apartment) errors.push('Apartment/Unit is required');
  if (!formData.countryCode) errors.push('Country code is required');
  if (!formData.state) errors.push('State/Region is required');

  // Media validation
  if (!formData.coverPhoto) errors.push('Cover photo is required');

  // Property details validation
  if (!formData.propertyDetails?.description) errors.push('Property description is required');
  if (formData.propertyDetails?.description && formData.propertyDetails.description.length < 20) {
    errors.push('Description must be at least 20 characters long');
  }

  // Price validation
  if (!formData.price || parseFloat(formData.price) <= 0) errors.push('Valid price is required');

  // Contact info validation
  if (!formData.firstName) errors.push('First name is required');
  if (!formData.lastName) errors.push('Last name is required');
  if (!formData.email) errors.push('Email is required');
  if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
    errors.push('Valid email address is required');
  }

  // Swap category specific validation
  if (formData.category === 'Swap' && !formData.propertyDetails?.listingDuration) {
    errors.push('Listing duration is required for Swap category');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Creates form-data structure for API submission based on Postman examples
 * This matches the exact structure expected by the backend
 */
export function createFormDataPayload(formData: PropertyListingFormState): FormData {
  const formDataObj = new FormData();
  
  // Basic Info
  formDataObj.append('category', formData.category || 'Rent');
  formDataObj.append('propertyType', formData.propertyType || 'Apartment');
  formDataObj.append('condition', formData.condition || 'Good Condition');
  formDataObj.append('petPolicy', formData.petPolicy || 'pet-friendly');
  
  // Location (flat structure as shown in Postman)
  formDataObj.append('location.country', formData.country || '');
  formDataObj.append('location.countryCode', formData.countryCode || '');
  formDataObj.append('location.stateOrRegion', formData.state || '');
  formDataObj.append('location.district', formData.district || '');
  formDataObj.append('location.street', formData.streetAddress || '');
  formDataObj.append('location.apartment', formData.apartment || '');
  formDataObj.append('location.postalCode', formData.zipCode || '');
  formDataObj.append('location.fullAddress', formData.searchAddress || '');
  
  // Coordinates
  if (formData.location?.coordinates?.latitude) {
    formDataObj.append('location.coordinates.latitude', formData.location.coordinates.latitude.toString());
  }
  if (formData.location?.coordinates?.longitude) {
    formDataObj.append('location.coordinates.longitude', formData.location.coordinates.longitude.toString());
  }
  
  // Media
  if (formData.coverPhoto) {
    formDataObj.append('coverPhoto', formData.coverPhoto);
  }
  if (formData.uploads && formData.uploads.length > 0) {
    formData.uploads.forEach((upload, index) => {
      // Since we only have File objects in form state now
      if (upload instanceof File) {
        formDataObj.append('mediaUploads', upload);
      }
    });
  }
  if (formData.videoTourLink) {
    formDataObj.append('videoTourLink', formData.videoTourLink);
  }
  
  // Property Details (flat structure)
  if (formData.propertyDetails?.totalFloors) {
    formDataObj.append('propertyDetails.totalFloors', formData.propertyDetails.totalFloors);
  }
  if (formData.propertyDetails?.floor) {
    formDataObj.append('propertyDetails.floor', formData.propertyDetails.floor);
  }
  if (formData.propertyDetails?.totalAreaSqM) {
    formDataObj.append('propertyDetails.totalAreaSqM', formData.propertyDetails.totalAreaSqM);
  }
  if (formData.propertyDetails?.livingAreaSqM) {
    formDataObj.append('propertyDetails.livingAreaSqM', formData.propertyDetails.livingAreaSqM);
  }
  if (formData.propertyDetails?.bedroomAreaSqM) {
    formDataObj.append('propertyDetails.kitchenAreaSqM', formData.propertyDetails.bedroomAreaSqM);
  }
  if (formData.propertyDetails?.livingRooms) {
    formDataObj.append('propertyDetails.livingrooms', formData.propertyDetails.livingRooms.toString());
  }
  if (formData.propertyDetails?.bedrooms) {
    formDataObj.append('propertyDetails.bedrooms', formData.propertyDetails.bedrooms.toString());
  }
  if (formData.propertyDetails?.bathrooms) {
    formDataObj.append('propertyDetails.bathrooms', formData.propertyDetails.bathrooms.toString());
  }
  if (formData.propertyDetails?.parkingSpots) {
    formDataObj.append('propertyDetails.parkingSpots', formData.propertyDetails.parkingSpots.toString());
  }
  
  // Amenities (array format as shown in Postman)
  if (formData.propertyDetails?.amenities) {
    formData.propertyDetails.amenities.forEach(amenity => {
      formDataObj.append('propertyDetails.amenities[]', amenity);
    });
  }
  
  // Infrastructure (array format as shown in Postman)
  if (formData.propertyDetails?.infrastructure) {
    formData.propertyDetails.infrastructure.forEach(infra => {
      formDataObj.append('propertyDetails.infrastructure[]', infra);
    });
  }
  
  if (formData.propertyDetails?.description) {
    formDataObj.append('propertyDetails.description', formData.propertyDetails.description);
  }
  
  // Price (conditional based on category)
  if (formData.price) {
    const price = parseFloat(formData.price);
    const currency = formData.currency || 'EUR';
    
    switch (formData.category) {
      case 'Sale':
        formDataObj.append('propertyDetails.price.salePrice.salePrice', price.toString());
        break;
      case 'Rent':
        const monthlyPrice = formData.rentType === 'Yearly' ? price / 12 : price;
        const yearlyPrice = formData.rentType === 'Yearly' ? price : price * 12;
        formDataObj.append('propertyDetails.price.rent.monthly', monthlyPrice.toString());
        formDataObj.append('propertyDetails.price.rent.yearly', yearlyPrice.toString());
        break;
      case 'Swap':
        const swapMonthlyPrice = formData.rentType === 'Yearly' ? price / 12 : price;
        const swapYearlyPrice = formData.rentType === 'Yearly' ? price : price * 12;
        formDataObj.append('propertyDetails.price.swap.monthly', swapMonthlyPrice.toString());
        formDataObj.append('propertyDetails.price.swap.yearly', swapYearlyPrice.toString());
        break;
    }
    
    // Currency is inside price object
    formDataObj.append('propertyDetails.price.currency', currency);
  }
  
  // Price-related boolean fields
  formDataObj.append('propertyDetails.negotiatedPrice', (formData.isNegotiated || false).toString());
  formDataObj.append('propertyDetails.notForCreditSale', (formData.notForCreditSale || false).toString());
  formDataObj.append('propertyDetails.readyToCooperateWithAgents', (formData.readyToCooperateWithAgents || false).toString());
  formDataObj.append('propertyDetails.possibleExchange', (formData.possibleExchange || false).toString());
  
  // Contact Info (flat structure as shown in Postman)
  if (formData.firstName) {
    formDataObj.append('contactInfo.firstName', formData.firstName);
  }
  if (formData.lastName) {
    formDataObj.append('contactInfo.lastName', formData.lastName);
  }
  if (formData.email) {
    formDataObj.append('contactInfo.email', formData.email);
  }
  if (formData.phoneNumber) {
    formDataObj.append('contactInfo.phoneNumber', formData.phoneNumber);
  }
  if (formData.openForTourSchedule !== undefined) {
    formDataObj.append('contactInfo.openForTourSchedule', formData.openForTourSchedule.toString());
  }
  if (formData.offerType) {
    // Map the offer type to the correct enum values expected by backend
    let mappedOfferType: string = formData.offerType;
    if (formData.offerType === 'private') {
      mappedOfferType = 'Private person';
    } else if (formData.offerType === 'agent') {
      mappedOfferType = 'Real estate agent';
    }
    formDataObj.append('contactInfo.typeOfOffer', mappedOfferType);
  }
  
  // Ad Promotion (flat structure as shown in Postman)
  if (formData.selectedTier) {
    formDataObj.append('adPromotion.selectedTier', formData.selectedTier);
  }
  if (formData.certifiedByFinder !== undefined) {
    formDataObj.append('adPromotion.certifiedByFinder', formData.certifiedByFinder.toString());
  }
  if (formData.liftsToTopCount) {
    formDataObj.append('adPromotion.liftsToTopCount', formData.liftsToTopCount.toString());
  }
  if (formData.detailedAnalytics !== undefined) {
    formDataObj.append('adPromotion.detailedAnalytics', formData.detailedAnalytics.toString());
  }
  if (formData.promotionStartDate) {
    formDataObj.append('adPromotion.promotionStartDate', formData.promotionStartDate.toISOString());
  }
  if (formData.promotionEndDate) {
    formDataObj.append('adPromotion.promotionEndDate', formData.promotionEndDate.toISOString());
  }
  if (formData.promotionPrice) {
    formDataObj.append('adPromotion.promotionPrice', formData.promotionPrice.toString());
  }
  if (formData.promotionCurrency) {
    formDataObj.append('adPromotion.currency', formData.promotionCurrency);
  }
  
  // Listing Duration (only for Swap category)
  if (formData.category === 'Swap' && formData.propertyDetails?.listingDuration) {
    const listingDuration = formData.propertyDetails.listingDuration;
    
    // Handle both object and string formats
    if (typeof listingDuration === 'object' && listingDuration !== null) {
      // If it's an object with startDate, endDate, quickSelect
      const durationObj = listingDuration as { startDate?: string; endDate?: string; quickSelect?: string };
      
      // Add start date
      if (durationObj.startDate) {
        formDataObj.append('listingDuration.startDate', durationObj.startDate);
      } else {
        formDataObj.append('listingDuration.startDate', new Date().toISOString());
      }
      
      // Add end date if available
      if (durationObj.endDate) {
        formDataObj.append('listingDuration.endDate', durationObj.endDate);
      }
      
      // Add quick select
      if (durationObj.quickSelect) {
        formDataObj.append('listingDuration.quickSelect', durationObj.quickSelect);
      }
    } else if (typeof listingDuration === 'string') {
      // If it's a string (legacy format), parse it
      const startDate = new Date();
      formDataObj.append('listingDuration.startDate', startDate.toISOString());
      
      // Extract quick select from the duration string
      if (listingDuration.includes('1 Month')) {
        formDataObj.append('listingDuration.quickSelect', '1 Month');
      } else if (listingDuration.includes('3 Months')) {
        formDataObj.append('listingDuration.quickSelect', '3 Months');
      } else if (listingDuration.includes('6 Months')) {
        formDataObj.append('listingDuration.quickSelect', '6 Months');
      } else if (listingDuration.includes('1 Year')) {
        formDataObj.append('listingDuration.quickSelect', '1 Year');
      }
    }
  }
  
  return formDataObj;
}

/**
 * Prepares the final payload for API submission
 */
export function prepareSubmissionPayload(formData: PropertyListingFormState) {
  const validation = validateFormData(formData);
  
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  return transformFormDataToPayload(formData);
} 