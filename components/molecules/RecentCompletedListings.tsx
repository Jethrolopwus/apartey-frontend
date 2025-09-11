"use client";
import React from "react";
import { Key, MessageSquare } from "lucide-react";
import { RecentCompleted } from "@/types/admin";




const getStatusColor = (status: string) => {
  switch (status) {
    case "Sale":
      return "bg-blue-100 text-blue-700";
    case "Rent":
      return "bg-green-100 text-green-700";
    case "Swap":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusContent = (status: string) => {
  switch (status) {
    case "Sale":
      return "Sold";
    case "Swap":
      return "Swapped";
    default:
      return "Rented";
  }
};

const getCurrencySymbol = (status: string) => {
  switch (status) {
    case "USD":
      return "$";
    case "NGN":
      return "₦";
    default:
      return "€";
  }
};

const getIcon = (iconType: string) => {
  switch (iconType) {
    case "Sale":
      return (
        <svg
          width="25"
          height="22"
          viewBox="0 0 25 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.1343 11.6503L20.2143 1.57031L23.6429 4.99888M16.3571 5.42745L19.3571 8.42745"
            stroke="#4147D5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.5 20.4263C7.17537 20.4263 7.84413 20.2933 8.46809 20.0349C9.09205 19.7764 9.65899 19.3976 10.1366 18.92C10.6141 18.4425 10.9929 17.8755 11.2514 17.2516C11.5098 16.6276 11.6429 15.9589 11.6429 15.2835C11.6429 14.6081 11.5098 13.9394 11.2514 13.3154C10.9929 12.6914 10.6141 12.1245 10.1366 11.6469C9.65899 11.1694 9.09205 10.7906 8.46809 10.5321C7.84413 10.2736 7.17537 10.1406 6.5 10.1406C5.13603 10.1406 3.82793 10.6825 2.86346 11.6469C1.89898 12.6114 1.35715 13.9195 1.35715 15.2835C1.35715 16.6475 1.89898 17.9556 2.86346 18.92C3.82793 19.8845 5.13603 20.4263 6.5 20.4263Z"
            stroke="#4147D5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "Rent":
      return (
        <svg
          width="29"
          height="28"
          viewBox="0 0 29 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17.8465 16.465H11.8465C12.5675 18.94 14.5415 20.2225 17.059 20.2225C17.8575 20.2225 18.789 20.154 19.233 20.0295V22.1975C18.756 22.3335 17.8355 22.4245 17.059 22.4245C13.222 22.4245 10.1275 20.381 9.2845 16.4655H7V15.1825H9.096C9.06407 14.8619 9.04938 14.5397 9.052 14.2175C9.052 13.8775 9.063 13.548 9.096 13.2305H7V11.9475H9.285C10.127 8.032 13.2325 6 17.0475 6C17.8015 6 18.7665 6.1135 19.2215 6.261V8.4175C18.7445 8.304 17.835 8.2135 17.0695 8.2135C14.5635 8.2135 12.578 9.4845 11.857 11.9475H17.846V13.2305H11.6025C11.567 13.5585 11.5487 13.8881 11.5475 14.218C11.5475 14.558 11.5695 14.876 11.5915 15.183H17.8465V16.465Z"
            fill="#11B371"
          />
        </svg>
      );
    case "Swap":
      return (
        <svg
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.49299 12.9842C5.27577 12.984 5.06438 13.0545 4.89079 13.1851C4.71721 13.3157 4.59087 13.4993 4.53088 13.708C4.47089 13.9168 4.48051 14.1395 4.55829 14.3423C4.63608 14.5451 4.77779 14.7171 4.96199 14.8322L7.64999 17.5202C7.7429 17.613 7.85319 17.6867 7.97456 17.7369C8.09593 17.7871 8.226 17.813 8.35735 17.8129C8.4887 17.8129 8.61875 17.7869 8.74008 17.7366C8.86141 17.6863 8.97165 17.6126 9.06449 17.5197C9.15734 17.4268 9.23097 17.3165 9.2812 17.1951C9.33142 17.0738 9.35724 16.9437 9.3572 16.8124C9.35715 16.681 9.33123 16.5509 9.28093 16.4296C9.23062 16.3083 9.1569 16.198 9.06399 16.1052L7.94299 14.9852H15.493C15.7582 14.9852 16.0126 14.8798 16.2001 14.6923C16.3876 14.5048 16.493 14.2504 16.493 13.9852C16.493 13.72 16.3876 13.4656 16.2001 13.2781C16.0126 13.0906 15.7582 12.9852 15.493 12.9852L5.49299 12.9842ZM19.507 11.0152C19.7242 11.0154 19.9356 10.9449 20.1092 10.8143C20.2828 10.6837 20.4091 10.5001 20.4691 10.2914C20.5291 10.0826 20.5195 9.85995 20.4417 9.65713C20.3639 9.45431 20.2222 9.28233 20.038 9.1672L17.35 6.4802C17.1624 6.29269 16.9079 6.18741 16.6426 6.1875C16.3774 6.18759 16.123 6.29306 15.9355 6.4807C15.748 6.66834 15.6427 6.92279 15.6428 7.18806C15.6429 7.45333 15.7484 7.70769 15.936 7.8952L17.057 9.0152H9.50699C9.24178 9.0152 8.98742 9.12056 8.79989 9.3081C8.61235 9.49563 8.50699 9.74999 8.50699 10.0152C8.50699 10.2804 8.61235 10.5348 8.79989 10.7223C8.98742 10.9098 9.24178 11.0152 9.50699 11.0152H19.507Z"
            fill="#F59E0B"
          />
        </svg>
      );

    default:
      return <Key className="w-5 h-5 text-gray-600" />;
  }
};

const RecentCompletedListings: React.FC<{ data: RecentCompleted[] }> = ({
  data,
}) => {
  return (
    <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
      <div className="mb-4 md:mb-6">
        <h3 className="text-base md:text-lg flex items-center font-semibold text-gray-800 mb-1">
          <MessageSquare className="w-6 h-6 mr-2 text-gray-700 mt-1" /> Recent
          Completed Listings
        </h3>
        <p className="text-xs md:text-sm text-gray-500">
          Latest successfully completed property transactions
        </p>
      </div>

      <div className="space-y-3 md:space-y-4">
        {data?.map((listing, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 md:p-4  rounded-[7px] border border-[#E5E5E5]"
          >
            <div className="flex items-center space-x-2 md:space-x-3 flex-1">
              <div className="flex-shrink-0">{getIcon(listing.category)}</div>
              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="text-xs md:text-sm font-medium text-gray-800 truncate">
                  {listing.propertyDetails.description}
                </h4>
                <p className="text-xs text-gray-500">
                  Owner: {listing.lister.firstName}, Completed{" "}
                  {listing.deactivationMeta.location}:{" "}
                  {new Date(listing.deactivationMeta.date).toDateString()}
                </p>
                <p className="text-xs font-medium text-gray-500 mt-1">
                  {getCurrencySymbol(listing.category)}{" "}
                  {listing.category === "Sale"
                    ? listing.propertyDetails.price.salePrice
                    : listing.category === "Rent"
                    ? listing.propertyDetails.price.rentPrice
                    : "Property Swapped"}
                </p>
              </div>
            </div>
            <div className="flex-shrink-0 ml-4">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                  listing.category
                )}`}
              >
                {getStatusContent(listing.category)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentCompletedListings;
