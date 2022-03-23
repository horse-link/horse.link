import React, { createContext, useEffect, useState } from "react";

export type GlobalErrorType = {
  setGlobalError(error: any): void;
};

export const GlobalErrorContext = createContext<GlobalErrorType>(null as any);

export const GlobalErrorProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [globalError, setGlobalError] = useState<any | undefined>(undefined);

  // const handleCloseModal = () => {
  //   setGlobalError(undefined);
  // };

  useEffect(() => {
    if (globalError) {
      console.log(globalError);
    }
  }, [globalError]);

  return (
    <GlobalErrorContext.Provider value={{ setGlobalError }}>
      {children}
      {globalError && (
        <div>
          <div>
            <p>
              Please try again. If the error persists please contact support
              with the details below.
            </p>
            <div className="mt-3">
              {propertyIfExists("IncidentId", globalError.incidentId)}
              {propertyIfExists("Status", globalError.statusCode)}
              {propertyIfExists("Reason", globalError.reason)}
              {propertyIfExists("Resource", globalError.resource)}
              {propertyIfExists("Message", globalError.message)}
              {propertyIfExists(
                "Validation Errors",
                globalError.validationErrors
              )}
            </div>
          </div>
        </div>
      )}
    </GlobalErrorContext.Provider>
  );
};

const propertyIfExists = (title: string, value: any) => {
  if (!value) {
    return null;
  }

  return (
    <div>
      <span className="font-bold">{title}: </span>
      <span>{JSON.stringify(value)}</span>
    </div>
  );
};
