import React from "react";
import { useGetAdminReviewsByIdQuery } from "@/Hooks/use-getAdminReviewsById.query";

interface AdminViewReviewModalProps {
  reviewId: string | null;
  onClose: () => void;
}

export default function AdminViewReviewModal({
  reviewId,
  onClose,
}: AdminViewReviewModalProps) {
  const { data, isLoading, error } = useGetAdminReviewsByIdQuery(
    reviewId || ""
  );

  if (!reviewId) return null;

  return (
    <div className="fixed inset-0 bg-[#00000070] flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-[450px]  min-h-48 rounded-[8px] p-7 shadow-lg">
        <h3 className="text-[20px] font-semibold text-[#000000]">
          Review Details
        </h3>
        <hr className="mt-2" />
        <div className=" max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <p className="text-[14px] text-center">Loading...</p>
          ) : error ? (
            <p className="text-[14px] text-red-500 text-center">
              Error: {(error as Error).message}
            </p>
          ) : data ? (
            <>
              <p className="text-sm font-semibold mt-2">
                {data.property || "N/A"}
              </p>

              <div className="flex justify-between items-center mt-1">
                {data?.flaggedByCount && data?.flaggedByCount > 0 && (
                  <p className="text-sm flex gap-2 items-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3 6C3 5.20435 3.31607 4.44129 3.87868 3.87868C4.44129 3.31607 5.20435 3 6 3H16C16.1857 3 16.3678 3.05171 16.5257 3.14935C16.6837 3.24698 16.8114 3.38668 16.8944 3.55279C16.9775 3.71889 17.0126 3.90484 16.996 4.08981C16.9793 4.27477 16.9114 4.45143 16.8 4.6L14.25 8L16.8 11.4C16.9114 11.5486 16.9793 11.7252 16.996 11.9102C17.0126 12.0952 16.9775 12.2811 16.8944 12.4472C16.8114 12.6133 16.6837 12.753 16.5257 12.8507C16.3678 12.9483 16.1857 13 16 13H6C5.73478 13 5.48043 13.1054 5.29289 13.2929C5.10536 13.4804 5 13.7348 5 14V17C5 17.2652 4.89464 17.5196 4.70711 17.7071C4.51957 17.8946 4.26522 18 4 18C3.73478 18 3.48043 17.8946 3.29289 17.7071C3.10536 17.5196 3 17.2652 3 17V6Z"
                        fill="#E7005C"
                      />
                    </svg>{" "}
                    Flagged by {data.flaggedByCount}{" "}
                    {data.flaggedByCount === 1
                      ? "person"
                      : data.flaggedByCount && data.flaggedByCount > 1
                      ? "people"
                      : "person"}
                  </p>
                )}

                <div className="flex text-sm gap-1 items-center">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.31804 6.31804C3.90017 6.7359 3.5687 7.23198 3.34255 7.77795C3.1164 8.32392 3 8.90909 3 9.50004C3 10.091 3.1164 10.6762 3.34255 11.2221C3.5687 11.7681 3.90017 12.2642 4.31804 12.682L12 20.364L19.682 12.682C20.526 11.8381 21.0001 10.6935 21.0001 9.50004C21.0001 8.30656 20.526 7.16196 19.682 6.31804C18.8381 5.47412 17.6935 5.00001 16.5 5.00001C15.3066 5.00001 14.162 5.47412 13.318 6.31804L12 7.63604L10.682 6.31804C10.2642 5.90017 9.7681 5.5687 9.22213 5.34255C8.67616 5.1164 8.09099 5 7.50004 5C6.90909 5 6.32392 5.1164 5.77795 5.34255C5.23198 5.5687 4.7359 5.90017 4.31804 6.31804Z"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-gray-400">Liked by </span>
                  <span className="bg-[#F3F4F6] text-gray-500 px-2 py-[2px] ml-1">
                    {data?.likedByCount}{" "}
                    {data?.likedByCount === 1
                      ? "person"
                      : data?.likedByCount && data.likedByCount > 1
                      ? "people"
                      : "person"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                {data?.flaggingReasons?.map((flag, index) => (
                  <div
                    key={index}
                    className="text-sm bg-[#FEF2F2] text-[#E7005C] border border-[#C8521299] p-2 rounded"
                  >
                    {flag.reason === "Other" ? flag.otherText : flag.reason}
                  </div>
                ))}
              </div>
              <h4 className="text-sm my-2">Review</h4>
              <div className="bg-[#F9FAFB] p-2 w-full text-sm h-[220px] overflow-y-auto ">
                <div className="flex justify-between text-gray-500 ">
                  <h5>By: {data.reviewer}</h5> <p>{data.date}</p>
                </div>
                <p className="mt-3 text-[#000000]">{data.comment}</p>
              </div>
            </>
          ) : (
            <p className="text-[14px] text-center">No review found</p>
          )}
        </div>
        <button
          onClick={() => onClose()}
          className="text-white cursor-pointer bg-[#C85212] hover:bg-[#a7440f] text-sm float-right mt-10 rounded-[8px] px-4 py-1.5"
        >
          Close
        </button>
      </div>
    </div>
  );
}
