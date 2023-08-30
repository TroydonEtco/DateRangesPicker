import * as React from "react";
import {
  Subtitle1,
  Popover,
  PopoverTrigger,
  PopoverSurface,
  PositioningProps,
  Tooltip,
  FluentProvider,
  teamsDarkTheme,
} from "@fluentui/react-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { DatePicker } from "./DatePicker";
import { DateRange } from "react-day-picker";
import { useSelectedDateRanges } from "./util/date";
import "react-day-picker/dist/style.css";
import Button from "./components/Button";
export interface IDateRangePickerProps {
  targetDocument: any;
}

const DateRangesPicker: React.FC<IDateRangePickerProps> = (
  props
): JSX.Element => {
  // const classes = useStyles();
  // const first = mergeClasses(classes.red, classes.rootPrimary);
  const { targetDocument } = props;
  const [selected, setSelected] = React.useState<DateRange>();

  // Callback to reset the selected date range in the parent state
  const handleResetSelected = () => {
    setSelected(undefined);
  };

  // TODO: Serialize the selected date range to string, and save it to dataverse by attached a js event handler to this custom code component
  // Helper function to generate a user-friendly list of dates
  // Custom hook for selected date ranges
  const {
    selectedDateRanges,
    handleAddSelectedDateRange,
    handleClearSelectedDateRanges,
  } = useSelectedDateRanges();

  // ... existing code ...

  // Callback to add the selected date range to the list
  const handleConfirmSelectedDates = () => {
    handleAddSelectedDateRange(selected);
    setSelected(undefined);
  };

  // Serialize the generatedDateList and save it to Power Apps column when the form is submitted
  const handleFormSubmission = () => {
    const serializedSelectedDateRanges = JSON.stringify(selectedDateRanges);
    // TODO: Save 'serializedSelectedDateRanges' to the Power Apps column using Power Apps connector or API call.
  };

  const offset: PositioningProps["offset"] = ({ positionedRect }) => {
    return { crossAxis: 100, mainAxis: positionedRect.width / 6 };
  };

  return (
    <div className={"pcf-container"}>
      <FluentProvider theme={teamsDarkTheme} className={".fluent-provider"}>
        <div className={"popover"}>
          <Subtitle1 className={"label"}>Enter Term Breaks</Subtitle1>
          <Popover positioning={{ position: "after", offset }}>
            <PopoverTrigger disableButtonEnhancement>
              {/* <Button appearance="primary">Click me</Button> */}
              <Tooltip
                withArrow
                content={{
                  children: "Enter class dates",
                  // className: classes.tooltip,
                }}
                relationship="label"
              >
                <div className={"calendar-button-container"}>
                  <Button
                    buttonClassName="calendar-button"
                    icon={<FontAwesomeIcon icon={faCalendar} />}
                    iconClassName="calendar-icon"
                  />
                </div>
              </Tooltip>
            </PopoverTrigger>

            <PopoverSurface style={{ minWidth: 80, top: 50 }}>
              <DatePicker
                label="Term Breaks"
                selected={selected}
                setSelected={setSelected}
                selectedDateRanges={selectedDateRanges}
                resetSelected={handleResetSelected} // Pass the resetSelected callback to the child
              />
              {/* Button to confirm and add the selected dates to the list */}
              <Button onClick={handleConfirmSelectedDates}>
                Add Selected Dates
              </Button>
            </PopoverSurface>
          </Popover>
        </div>
        {/* Display the selected date range */}
        <div className={"selected-dates"}>
          <p className={"selected-dates-label"}>Selected Date Ranges:</p>
          <div className="date-list-wrapper">
            <div className={"date-list-container"}>
              {" "}
              {/* Apply the date-list-container class */}
              <ul className={"date-list"}>
                {selectedDateRanges?.map((dateRange, index) => (
                  <li key={index}>
                    From: {dateRange.from?.toLocaleDateString()} - To:{" "}
                    {dateRange.to?.toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </div>
            {/* TODO: Add clear button to clear date ranges */}
            <div className={"clear-date-ranges"}>
              <Button onClick={handleClearSelectedDateRanges}>Clear</Button>
            </div>
          </div>
        </div>
      </FluentProvider>
    </div>
  );
};

export default DateRangesPicker;
