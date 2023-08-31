import * as React from "react";

import {
  DateRange,
  DayClickEventHandler,
  DayPicker,
  SelectRangeEventHandler,
} from "react-day-picker";
import { format, isSameMonth, addMonths, addYears } from "date-fns";
import { isLeapYear } from "./util/date";

interface IDateRangePickerProps {
  label: string;
  selected: DateRange | undefined;
  setSelected?: (dateRange: DateRange | undefined) => void;
  selectedDateRanges: DateRange[] | undefined;
  resetSelected?: () => void; // Add the resetSelected prop
}

const css = `
  .my-selected:not([disabled]) { 
    background-color: rgb(10, 99, 172);
    font-weight: bold; 
  }
  .my-selected:hover:not([disabled]) { 
    color: #b0cde7;
    background-color: rgb(53, 160, 247);
  }
  .my-today { 
    font-weight: bold;
    font-size: 140%; 
    color: rgb(17, 122, 207);
  }
`;

export const DatePicker: React.FC<IDateRangePickerProps> = ({
  label,
  selected,
  setSelected,
  selectedDateRanges,
  resetSelected,
}) => {
  const [error, setError] = React.useState<any>(undefined);
  const today: Date = new Date();
  const minDate: Date = addMonths(today, -12);
  const maxDate: Date = addYears(today, 1);
  const currentMonth = today.getMonth();
  const defaultMonth = new Date(today.getFullYear(), currentMonth);
  const [month, setMonth] = React.useState<Date>(defaultMonth);
  // avoid selecting the same date ranges
  const bookedStyle = { border: "2px solid currentColor" };
  const [booked, setBooked] = React.useState(false);
  let bookedDays: Date[] = [];
  if (selectedDateRanges) {
    selectedDateRanges.forEach((dateRange) => {
      const startDate = dateRange.from;
      const endDate = dateRange.to;

      if (startDate && endDate) {
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          bookedDays.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    });
  }

  const footer = booked ? (
    "This day is already booked!"
  ) : (
    <>
      <button
        disabled={isSameMonth(today, month)}
        onClick={() => setMonth(today)}
      >
        Today
      </button>

      {selected ? (
        <p>
          You picked {selected.from?.toLocaleDateString()} to{" "}
          {selected.to?.toLocaleDateString()}
        </p>
      ) : null}
      <button onClick={resetSelected}>Reset</button>
    </>
  );

  const handleDayClick: DayClickEventHandler = (day, modifiers) => {
    setBooked(day && modifiers.booked);
  };

  const handleSetSelected: SelectRangeEventHandler = (dateRange) => {
    if (setSelected) {
      if (!booked) {
        setSelected(dateRange);
      } else {
        setSelected(undefined);
      }
    }
  };

  return (
    <>
      <style>{css}</style>
      <div>
        <p>{`Select ${label}. Range: ${minDate.toDateString()} - ${maxDate.toDateString()}`}</p>
        <DayPicker
          captionLayout="dropdown-buttons"
          mode="range"
          showOutsideDays={true}
          defaultMonth={defaultMonth}
          month={month}
          fromMonth={minDate}
          toMonth={maxDate}
          onMonthChange={setMonth}
          selected={selected}
          onSelect={handleSetSelected}
          modifiers={{ booked: bookedDays }}
          modifiersClassNames={{
            selected: "my-selected",
            today: "my-today",
          }}
          modifiersStyles={{
            disabled: { fontSize: "75%" },
            booked: bookedStyle,
          }}
          min={2}
          max={isLeapYear() ? 366 : 365}
          onDayClick={handleDayClick}
          footer={footer}
        />
      </div>
    </>
  );
};
