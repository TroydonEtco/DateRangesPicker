import React = require("react");
import { DateRange } from "react-day-picker";

export function isLeapYear() {
  const now = new Date();
  const year = now.getFullYear();

  // A year is a leap year if it is divisible by 4,
  // except for years that are both divisible by 100 and not divisible by 400.
  if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
    return true;
  } else {
    return false;
  }
}

// Custom hook to handle selected date ranges
export const useSelectedDateRanges = (dateRanges: string | undefined) => {
  const deserializedDateRanges: DateRange[] = JSON.parse(dateRanges || "");
  const [selectedDateRanges, setSelectedDateRanges] = React.useState<
    DateRange[] | undefined
  >(deserializedDateRanges || []);

  // Function to add a selected date range to the list
  const handleAddSelectedDateRange = (dateRange: DateRange | undefined) => {
    setSelectedDateRanges((prevSelectedDateRanges: DateRange[] | undefined) => [
      ...(prevSelectedDateRanges || []),
      ...(dateRange ? [dateRange] : []), // Cast dateRange as an array or use an empty array if dateRange is undefined
    ]);
  };

  // Function to clear all selected date ranges
  const handleClearSelectedDateRanges = () => {
    setSelectedDateRanges([]);
  };

  return {
    selectedDateRanges,
    handleAddSelectedDateRange,
    handleClearSelectedDateRanges,
  };
};
