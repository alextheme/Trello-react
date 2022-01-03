// Session Storage action for Token
export const getToken = (): string | null => sessionStorage.getItem('token');
export const setToken = (token: string): void => {
  sessionStorage.setItem('token', token);
};
export const removeToken = (): void => {
  sessionStorage.removeItem('token');
};
