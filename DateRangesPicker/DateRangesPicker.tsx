import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { DatePicker } from "./DatePicker";
import { DateRange } from "react-day-picker";
import { Popover } from "react-tiny-popover";
import { useSelectedDateRanges } from "./util/date";
import "react-day-picker/dist/style.css";
import Button from "./components/Button";

export interface IDateRangePickerProps {
  targetDocument: any;
  dateRanges?: string | undefined;
  dateRangesChanged?: (newValue: string | undefined) => void;
}

export interface IDateRangePickerState
  extends React.ComponentState,
    IDateRangePickerProps {}

const DateRangesPicker: React.FC<IDateRangePickerProps> = (
  props
): JSX.Element => {
  // const classes = useStyles();
  // const first = mergeClasses(classes.red, classes.rootPrimary);
  const { targetDocument, dateRanges } = props;
  const [selected, setSelected] = React.useState<DateRange>();
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
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
  } = useSelectedDateRanges(props.dateRanges);

  // ... existing code ...

  // Callback to add the selected date range to the list
  const handleConfirmSelectedDates = () => {
    handleAddSelectedDateRange(selected);
    setSelected(undefined);
    if (props.dateRangesChanged) {
      props.dateRangesChanged(
        JSON.stringify([...(selectedDateRanges || []), selected])
      );
    }
  };

  const handleResetSelectedDates = () => {
    handleClearSelectedDateRanges();
    if (props.dateRangesChanged) {
      props.dateRangesChanged(JSON.stringify([]));
    }
  };

  // Serialize the generatedDateList and save it to Power Apps column when the form is submitted
  const handleFormSubmission = () => {
    const serializedSelectedDateRanges = JSON.stringify(selectedDateRanges);
    // TODO: Save 'serializedSelectedDateRanges' to the Power Apps column using Power Apps connector or API call.
  };

  return (
    <div className={"pcf-container"}>
      <div className={"pcf-content"}>
        <div className={"popover"}>
          <div className={"label"}>Enter Term Breaks</div>
          <Popover
            isOpen={isPopoverOpen}
            positions={["right", "bottom", "top", "left"]} // preferred positions by priority
            onClickOutside={() => setIsPopoverOpen(!isPopoverOpen)}
            content={
              <>
                <DatePicker
                  label="Term Breaks"
                  selected={selected}
                  setSelected={setSelected}
                  selectedDateRanges={selectedDateRanges}
                  resetSelected={handleResetSelected} // Pass the resetSelected callback to the child
                />
                <Button
                  onClick={handleConfirmSelectedDates}
                  buttonClassName="add-selected-btn"
                >
                  Add Selected Dates
                </Button>
                <Button onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
                  Close
                </Button>
              </>
            }
          >
            <div className={"calendar-button-container"}>
              <Button
                title="calendar-button"
                onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                buttonClassName="calendar-button"
                icon={<FontAwesomeIcon icon={faCalendar} />}
                iconClassName="calendar-icon"
              />
            </div>
          </Popover>
        </div>

        <div className={"selected-dates"}>
          <p className={"selected-dates-label"}>Selected Date Ranges:</p>
          <div className="date-list-wrapper">
            <div className={"date-list-container"}>
              {" "}
              {/* Apply the date-list-container class */}
              <ul className={"date-list"}>
                {selectedDateRanges?.map((dateRange, index) => (
                  <li key={index}>
                    From:{" "}
                    {dateRange.from
                      ? new Date(dateRange.from).toLocaleDateString()
                      : ""}{" "}
                    - To: From:{" "}
                    {dateRange.to
                      ? new Date(dateRange.to).toLocaleDateString()
                      : ""}
                  </li>
                ))}
              </ul>
            </div>

            {/* TODO: Add clear button to clear date ranges */}
            {/* <div style={{ color: "white", backgroundColor: "#ccc" }}> */}

            <div className={"clear-date-ranges"}>
              <Button onClick={handleResetSelectedDates}>Clear</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateRangesPicker;
