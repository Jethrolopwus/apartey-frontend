"use client";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { StayDetails } from "@/types/generated";

type Props = {
  register: UseFormRegister<StayDetails>;
  errors: FieldErrors<StayDetails>;
};

export default function StayDetailsInputs({ register, errors }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      {/* Number of Rooms */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Rooms
        </label>
        <input
          type="number"
          min="1"
          {...register("numberOfRooms", {
            required: "Number of rooms is required",
            valueAsNumber: true,
            min: {
              value: 1,
              message: "At least 1 room is required",
            },
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.numberOfRooms && (
          <p className="text-red-500 text-sm mt-1">
            {errors.numberOfRooms.message}
          </p>
        )}
      </div>

      {/* Number of Occupants */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Occupants
        </label>
        <input
          type="number"
          min="1"
          {...register("numberOfOccupants", {
            required: "Number of occupants is required",
            valueAsNumber: true,
            min: {
              value: 1,
              message: "At least 1 occupant is required",
            },
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.numberOfOccupants && (
          <p className="text-red-500 text-sm mt-1">
            {errors.numberOfOccupants.message}
          </p>
        )}
      </div>
    </div>
  );
}