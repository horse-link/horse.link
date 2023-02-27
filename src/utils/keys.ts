const PREVIOUS_KEYS: Array<string> = [];
export const generateRandomKey = () => {
  const newKey = Math.random().toString();
  // recursively generate new keys until a unique one is found
  if (PREVIOUS_KEYS.includes(newKey)) generateRandomKey();
  PREVIOUS_KEYS.push(newKey);

  return newKey;
};
