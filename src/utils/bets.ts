export const calculateBetTableMaxPages = (
  betsArrayLength: number,
  pagination: number
) => Math.ceil(betsArrayLength / pagination);

export const incrementPage = (page: number, maxPages: number) =>
  page + 1 > maxPages || page + 1 < 1 ? maxPages : page + 1;

export const decrementPage = (page: number, maxPages: number) =>
  page - 1 < 1 || page - 1 > maxPages ? maxPages : page - 1;
