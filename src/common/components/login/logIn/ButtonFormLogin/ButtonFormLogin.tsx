import React from 'react';

interface IButtonFormLoginProps {
  formAuthorization: boolean;
  handleUserLogIn: (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => Promise<void>;
  handleUserRegistration: (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => Promise<void>;
  titleForm: string;
  buttonActive: boolean;
}
const ButtonFormLogin: React.FC<IButtonFormLoginProps> = ({
  formAuthorization,
  handleUserLogIn,
  handleUserRegistration,
  titleForm,
  buttonActive,
}): JSX.Element => (
  <input
    type="submit"
    onClick={formAuthorization ? handleUserLogIn : handleUserRegistration}
    value={formAuthorization ? 'Sign in' : 'Register now'}
    className={`${titleForm}-submit ${buttonActive ? 'active' : ''}`}
  />
);

export default ButtonFormLogin;
