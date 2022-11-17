export const calculateBetTableMaxPages = (
  betsArrayLength: number,
  pagination: number
) => Math.ceil(betsArrayLength / pagination);
