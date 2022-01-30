// Session Storage action for Token
export const getFromSessionStorageToken = (): string | null => sessionStorage.getItem('token');
export const setInSessionStorageToken = (token: string): void => {
  sessionStorage.setItem('token', token);
};
export const removeFromSessionStorageToken = (): void => {
  sessionStorage.removeItem('token');
};
