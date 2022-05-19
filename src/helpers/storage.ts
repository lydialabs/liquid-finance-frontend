const STORAGE_KEY = {
  ACCOUNT: "ACCOUNT",
};

export const setAccountStorage = (account: string | object) => {
  localStorage.setItem(STORAGE_KEY.ACCOUNT, JSON.stringify(account));
};

export const getAccountStorage = () => {
  const localData = localStorage.getItem(STORAGE_KEY.ACCOUNT);
  return localData ? JSON.parse(localData) : undefined;
};

export const removeAccountStorage = () => {
  localStorage.removeItem(STORAGE_KEY.ACCOUNT);
};
