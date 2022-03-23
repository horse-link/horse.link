export const getApiError = (error: any): any | undefined => {
  if (!error.statusCode) {
    return undefined;
  }

  return error as any;
};

export const getBadRequestMessage = (
  error: any
): string => {
  const errorCodeToMessageMap: { [key in any]: string } = {
    EMAIL_IN_USE:
      "The email you supplied is assocated with another account. Please log in."
  };

  return errorCodeToMessageMap[error.code];
};
