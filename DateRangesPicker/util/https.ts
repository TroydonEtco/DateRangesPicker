import { IInputs } from "../generated/ManifestTypes";

export async function getDummyDateRanges(): Promise<string | undefined> {
  return '[{"from":"2023-08-31T12:00:00.000Z","to":"2023-09-06T12:00:00.000Z"},{"from":"2023-09-07T12:00:00.000Z","to":"2023-09-15T12:00:00.000Z"}]';
}

// Function to fetch Dataverse data
export async function fetchDataverseDataSingle(
  context: ComponentFramework.Context<IInputs>,
  entityName: string,
  requiredAttributeName: string,
  requiredAttributeValue: string,
  requestedAttrName: string
): Promise<string | undefined> {
  // Construct the URL for the Dataverse Web API request
  // const queryString = `?$select=${requestedAttrName}&$filter=contains(${requiredAttributeName},'${requiredAttributeValue}')`;

  // Make the GET request to retrieve data
  try {
    // Invoke the Web API Retrieve Single call
    //if (queryString) {
    const response = await context.webAPI.retrieveRecord(
      entityName,
      requiredAttributeValue
    );

    // Process the retrieved data
    const value: string = response[requestedAttrName];
    return value ?? "[]";
    // }

    // Process the retrieved data as needed
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

export async function fetchDataverseDataMultiple(
  context: ComponentFramework.Context<IInputs>,
  entityName: string,
  requiredAttributeName: string,
  requiredAttributeValue: string,
  requestedAttrName: string
): Promise<string | undefined> {
  // Construct the URL for the Dataverse Web API request
  const queryString = `?$select=${requestedAttrName}&$filter=contains(${requiredAttributeName},'${requiredAttributeValue}')`;

  // Make the GET request to retrieve data
  try {
    // Invoke the Web API Retrieve Single call
    const response = await context.webAPI.retrieveRecord(
      entityName,
      requiredAttributeValue,
      queryString
    );

    let value: string | undefined;

    for (const entity of response.entities) {
      value = entity[requestedAttrName];
    }

    // Process the retrieved data
    return value ?? "[]";

    // Process the retrieved data as needed
  } catch (error) {
    console.error("Fetch error:", error);
  }
}
