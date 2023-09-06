import DateRangePicker, { IDateRangePickerProps } from "./DateRangesPicker";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import {
  fetchDataverseDataMultiple,
  fetchDataverseDataSingle,
  getDummyDateRanges,
} from "./util/https";

export class DateRangesPicker
  implements ComponentFramework.ReactControl<IInputs, IOutputs>
{
  private _context: ComponentFramework.Context<IInputs>;
  private notifyOutputChanged: () => void;
  private theContainer: HTMLDivElement;
  public props: IDateRangePickerProps = {
    targetDocument: undefined,
    dateRangesChanged: this.selectedDateRangesChanged.bind(this),
    requestData: this.retrieveDummyDateRanges.bind(this), // UNCOMMENT when using test data
    // requestData: this.retrieveDataverseData.bind(this),
  };

  private static _entityName = "new_eventseries";
  private static _requiredAttributeName = "new_eventseriesid";
  private static _dateRangesAttributeName = "new_datestoskip";

  /**
   * Empty constructor.
   */
  constructor() {}

  /**
   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
   * Data-set values are not initialized here, use updateView.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
   */
  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    this.notifyOutputChanged = notifyOutputChanged;
    this._context = context;
    this.props.dateRanges = "[]";
  }

  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   * @returns ReactElement root react element for the control
   */
  public updateView(
    context: ComponentFramework.Context<IInputs>
  ): React.ReactElement {
    // Initialize a variable to store the container element
    let containerElement: React.ReactElement | null = null;
    const containerStyle: React.CSSProperties = {
      backgroundColor: "#b0cde7",
      padding: "1px",
      border: "1px solid #b0cde7",
      borderRadius: "5%",
      width: 400,
      height: 300,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };

    const dateRangesPicker = React.createElement(DateRangePicker, this.props);
    containerElement = React.createElement(
      "div",
      { style: containerStyle },
      dateRangesPicker
    );

    return containerElement;
  }

  private selectedDateRangesChanged(newValue: string | undefined) {
    if (this.props.dateRanges !== newValue) {
      this.props.dateRanges = newValue;
      this.notifyOutputChanged();
    }
  }

  private async retrieveDummyDateRanges(): Promise<string | undefined> {
    let dummyData = await getDummyDateRanges();
    return dummyData;
  }

  private async retrieveDataverseData(
    retrieveMultiple: boolean
  ): Promise<string | undefined> {
    if (retrieveMultiple) {
      return await fetchDataverseDataMultiple(
        this._context,
        DateRangesPicker._entityName,
        DateRangesPicker._requiredAttributeName,
        (<any>this._context.mode).contextInfo.entityId,
        //"392b47dc-68e6-486c-ac44-1b0751e3b2f2",
        DateRangesPicker._dateRangesAttributeName
      );
    } else {
      return await fetchDataverseDataSingle(
        this._context,
        DateRangesPicker._entityName,
        DateRangesPicker._requiredAttributeName,
        (<any>this._context.mode).contextInfo.entityId,
        //"392b47dc-68e6-486c-ac44-1b0751e3b2f2",
        DateRangesPicker._dateRangesAttributeName
      );
    }
  }

  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
   */
  public getOutputs(): IOutputs {
    return {
      dateRanges: this.props.dateRanges,
    };
  }

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    // Add code to cleanup control if necessary
  }
}
