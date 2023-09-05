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
  requestData?: (newValue: boolean) => Promise<string | undefined>;
}

export interface IDateRangePickerState
  extends React.ComponentState,
    IDateRangePickerProps {}

const DateRangePicker: React.FC<IDateRangePickerProps> = (
  props
): JSX.Element => {
  const [selected, setSelected] = React.useState<DateRange>();
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [dataFetched, setDataFetched] = React.useState(false);

  // Callback to reset the selected date range in the parent state
  const handleResetSelected = () => {
    setSelected(undefined);
  };

  // Custom hook for selected date ranges
  const {
    selectedDateRanges,
    handleAddSelectedDateRange,
    handleClearSelectedDateRanges,
    handleSetSelectedDateRange,
  } = useSelectedDateRanges(props.dateRanges);

  // try to initialize with requested data
  React.useEffect(() => {
    if (
      !dataFetched &&
      (!selectedDateRanges || selectedDateRanges.length < 1)
    ) {
      // Fetch data because selectedDateRanges is empty or has fewer than 1 elements
      if (props.requestData) {
        props.requestData(false).then((newDateRangeData) => {
          if (props.dateRangesChanged) {
            props.dateRangesChanged(newDateRangeData);
            if (newDateRangeData) {
              handleSetSelectedDateRange(newDateRangeData);
              setDataFetched(true); // Mark data as fetched
            }
          }
        });
      }
    }
  }, [props.dateRanges]);

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
                    - To:{" "}
                    {dateRange.to
                      ? new Date(dateRange.to).toLocaleDateString()
                      : ""}
                  </li>
                ))}
              </ul>
            </div>
            <div className={"clear-date-ranges"}>
              <Button onClick={handleResetSelectedDates}>Clear</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;
