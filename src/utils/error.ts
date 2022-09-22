export const getApiError = (error: any): any | undefined => {
  if (!error.statusCode) {
    return undefined;
  }

  return error as any;
};
