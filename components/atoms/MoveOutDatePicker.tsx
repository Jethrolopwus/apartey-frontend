"use client";
import React from "react";
import DatePicker from "react-datepicker";
import { Calendar } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import { MoveOutDatePickerProps } from "@/types/generated";

const MoveOutDatePicker: React.FC<MoveOutDatePickerProps> = ({
  value = "",
  onChange,
}) => {
  const parsedDate = value ? new Date(value) : null;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        When did you leave this property?
      </label>
      <div className="relative">
        <DatePicker
          selected={parsedDate}
          onChange={(date: Date | null) => {
            if (date) onChange(date.toISOString().split("T")[0]);
          }}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select date"
          className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};

export default MoveOutDatePicker;
