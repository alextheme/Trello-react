/* eslint-disable prettier/prettier */
/* eslint-disable no-debugger */
/* eslint-disable arrow-body-style */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* es lint-disable react/destructuring-assignment, @typescript-eslint/ban-ts-comment */
import React from 'react';
import { connect } from 'react-redux';
import PasswordStrengthBar, { PasswordFeedback } from 'react-password-strength-bar';
import instance from '../../../../api/request';
import { authorization } from '../../../../store/modules/user/action-creators';
import './formLogIn.scss';

interface PropsType {
  userAuthorization?: (email: string, password: string) => void;
}

type StateType = {
  formAuthorization: boolean;
  buttonActive: boolean;
  name: string;
  nameOk: boolean;
  email: string;
  emailOk: boolean;
  fPassword: string;
  fPasswordIsComplex: number;
  fPasswordOk: boolean;
  sPassword: string;
  sPpasswordOk: boolean;
  error: string[];
};

class FormAuthorization extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      formAuthorization: !0,
      buttonActive: !0,
      name: 'Vasja',
      nameOk: true,
      email: 'ae1@gmail.com',
      emailOk: true,
      fPassword: '1111',
      fPasswordIsComplex: 0,
      fPasswordOk: true,
      sPassword: '1111',
      sPpasswordOk: true,
      error: [],
    };
    this.formSwitcher = this.formSwitcher.bind(this);
    this.handleInputName = this.handleInputName.bind(this);
    this.handleUserLogIn = this.handleUserLogIn.bind(this);
    this.handleUserRegistration = this.handleUserRegistration.bind(this);
    this.setButtonActive = this.setButtonActive.bind(this);
    this.callBackPasswordStrengBar = this.callBackPasswordStrengBar.bind(this);
    this.handleInputOnChange = this.handleInputOnChange.bind(this);
  }

  componentDidMount(): void {
    const { email, fPassword: password, sPassword: password2 } = this.state;
    const buttonActive = !(email === '' || password === '' || password2 === '');
    this.setState({ buttonActive });
  }

  handleInputName(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ name: e.target.value });
  }

  handleInputOnChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const {
      target: { id, value },
    } = e;
    this.setState((state) => ({ ...state, [id]: value, error: [] }));

    // почему то состояние реакта отстает в распознаинни заполнения поля на один символ,
    // чтобы избежать этого передаем в функцию текущее вводные данные с инпута.
    this.setButtonActive(id, value);
  }

  formSwitcher = (): void => {
    this.setState((state) => ({ formAuthorization: !state.formAuthorization }));
  };

  setButtonActive = (id: string, value: string): void => {
    const { email, fPassword, sPassword } = this.state;
    const vEmail     = id === 'email'     && !!(value || email);
    const vPassword  = id === 'fPassword' && !!(value || fPassword);
    const vPassword2 = id === 'sPassword' && !!(value || sPassword);
    
    this.setState({ buttonActive: vEmail && vPassword && vPassword2 });
  };

  // Authorization
  async handleUserLogIn(event: React.MouseEvent<HTMLInputElement>): Promise<void> {
    event.preventDefault();
    if (this.state.buttonActive) {
      const { authorizationUser } = this.props as { authorizationUser: (email: string, password: string) => void };
      const { email, fPassword: password } = this.state;
      authorizationUser(email, password);
    }
  }

  // Registration
  async handleUserRegistration(event: React.MouseEvent<HTMLInputElement>): Promise<void> {
    event.preventDefault();

    if (this.state.buttonActive) {
      if (this.validateEmail() && this.checkPasswordComplex() && this.checkPasswordEquality()) {
        const { email, fPassword: password } = this.state;

        const result = (await instance.post('/user', { email, password })) as { result: string; id: number };
        if (result && result.result === 'Created') {
          this.formSwitcher();
          this.setState({ email, fPassword: password }); // TODO ? нужно ли сохранять эти данные ???
          console.log('Created success!');
        } else {
          console.log('Created false (');
        }
      }
    }
  }

  // validetion Email
  validateEmail = (): boolean => {
    const { email, error } = this.state;
    const message = 'Неправильный электронный адрес.';
    const pattern = /^[\w\-.]+@[\w-]+\.[a-z]{2,4}$/i;

    if (!pattern.test(email)) {
      const result = error.find((e) => e === message);
      if (!result) {
        error.push(message);
      }
      this.setState({ emailOk: false, error });
      return false;
    }

    this.setState({ emailOk: true, error: error.filter((e) => e !== message) });
    return true;
  };

  // Checking passwords for complexity
  checkPasswordComplex = (): boolean => {
    const { fPasswordOk: passwordOk, error } = this.state;
    const message = 'Пароль слишком простой';

    if (!passwordOk) {
      const result = error.find((e) => e === message);
      if (!result) {
        error.push(message);
      }
      this.setState({ fPasswordOk: false, error });
      return false;
    }

    this.setState({ error: error.filter((e) => e !== message) });
    return true;
  };

  // Checking passwords for equality
  checkPasswordEquality = (): boolean => {
    const { fPassword: password, sPassword: password2, error } = this.state;
    const message = 'Пароли не совпадают';

    if (password.length !== password2.length && password !== password2) {
      const result = error.find((e) => e === message);
      if (!result) {
        error.push(message);
      }
      this.setState({ sPpasswordOk: false, error });
      return false;
    }

    this.setState({ sPpasswordOk: true, error: error.filter((e) => e !== message) });
    return true;
  };

  callBackPasswordStrengBar = (score: number, feedback: PasswordFeedback): void => {
    const { fPasswordIsComplex: passwordIsComplex } = this.state;
    this.setState({ fPasswordOk: score >= passwordIsComplex });
  };

  render(): JSX.Element | null {
    const {
      formAuthorization,
      buttonActive,
      fPassword,
      fPasswordOk,
      email,
      emailOk,
      error,
      sPassword,
      sPpasswordOk,
    } = this.state;

    const titleForm = formAuthorization ? 'authorization' : 'registration';

    return (
      <div className={`${titleForm}-box`}>
        <div className={`${titleForm}-container`}>
          <h4 className={`${titleForm}-title`}>{titleForm}</h4>
          <form className={`${titleForm}-form`}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className={emailOk ? '' : 'errorValue'}
              defaultValue={email}
              onChange={this.handleInputOnChange}
            />
            <label htmlFor="fPassword">Password</label>
            <input
              type="password"
              id="fPassword"
              name="fPassword"
              className={fPasswordOk ? '' : 'errorValue'}
              defaultValue={fPassword}
              onChange={this.handleInputOnChange}
            />
            {!formAuthorization && (
              <PasswordStrengthBar
                password={fPassword}
                // className="passwordStrengBar"
                className={fPasswordOk ? 'passwordStrengBar' : 'passwordStrengBar errorValue'}
                onChangeScore={this.callBackPasswordStrengBar}
              />
            )}
            {!formAuthorization && (
              <>
                <label htmlFor="sPassword">Repeat password</label>
                <input
                  type="password"
                  id="sPassword"
                  name="sPassword"
                  className={sPpasswordOk ? '' : 'errorValue'}
                  defaultValue={sPassword}
                  onChange={this.handleInputOnChange}
                />

                <div className="textError">
                  {error.map((m, i) => {
                    // eslint-disable-next-line react/no-array-index-key
                    return <p key={i}>{m}</p>;
                  })}
                </div>
              </>
            )}

            <input
              type="submit"
              onClick={formAuthorization ? this.handleUserLogIn : this.handleUserRegistration}
              value={formAuthorization ? 'Sign in' : 'Register now'}
              className={`${titleForm}-submit ${buttonActive ? 'active' : ''}`}
            />

            {!formAuthorization && (
              <p className={`${titleForm}-already`}>
                Already have an account? <span onClick={this.formSwitcher}>Sign in</span>
              </p>
            )}

            {formAuthorization && (
              <p className={`${titleForm}-already`}>
                First time with us? <span onClick={this.formSwitcher}>Register now</span>
              </p>
            )}
          </form>
        </div>
      </div>
    );
  }
}

export default connect(null, { authorizationUser: authorization })(FormAuthorization);
