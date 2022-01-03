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
  password: string;
  passwordIsComplex: number;
  passwordOk: boolean;
  password2: string;
  password2Ok: boolean;
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
      password: '1111',
      passwordIsComplex: 0,
      passwordOk: true,
      password2: '1111',
      password2Ok: true,
      error: [],
    };
    this.formSwitcher = this.formSwitcher.bind(this);
    this.handleInputName = this.handleInputName.bind(this);
    this.handleUserLogIn = this.handleUserLogIn.bind(this);
    this.handleInputEmail = this.handleInputEmail.bind(this);
    this.handleInputPassword = this.handleInputPassword.bind(this);
    this.handleInputSecondPassword = this.handleInputSecondPassword.bind(this);
    this.handleUserRegistration = this.handleUserRegistration.bind(this);
    this.setButtonActive = this.setButtonActive.bind(this);
    this.callBackPasswordStrengBar = this.callBackPasswordStrengBar.bind(this);
  }

  componentDidMount(): void {
    const { email, password, password2 } = this.state;
    const buttonActive = !(email === '' || password === '' || password2 === '');
    this.setState({ buttonActive });
  }

  handleInputName(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ name: e.target.value });
  }

  handleInputEmail(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ email: e.target.value, error: [] });
    this.setButtonActive(e.target.value, null, null);
  }

  handleInputPassword(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ password: e.target.value, error: [] });
    this.setButtonActive(null, e.target.value, null);
  }

  handleInputSecondPassword(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ password2: e.target.value, error: [] });
    this.setButtonActive(null, null, e.target.value);
  }

  formSwitcher = (): void => {
    this.setState((state) => ({ formAuthorization: !state.formAuthorization }));
  };

  setButtonActive = (e: string | null, p: string | null, p2: string | null): void => {
    const { email, password, password2 } = this.state;
    const Vemail = e === null ? email : e;
    const Vpassword = p === null ? password : p;
    const Vpassword2 = p2 === null ? password2 : p2;

    if (Vemail && Vpassword && Vpassword2) {
      this.setState({ buttonActive: !0 });
    } else {
      this.setState({ buttonActive: !1 });
    }
  };

  // Authorization
  async handleUserLogIn(event: React.MouseEvent<HTMLInputElement>): Promise<void> {
    event.preventDefault();
    if (this.state.buttonActive) {
      const { authorizationUser } = this.props as { authorizationUser: (email: string, password: string) => void };
      const { email, password } = this.state;
      authorizationUser(email, password);
    }
  }

  // Registration
  async handleUserRegistration(event: React.MouseEvent<HTMLInputElement>): Promise<void> {
    event.preventDefault();

    if (this.state.buttonActive) {
      if (this.validateEmail() && this.checkPasswordComplex() && this.checkPasswordEquality()) {
        const { email, password } = this.state;

        const result = (await instance.post('/user', { email, password })) as { result: string; id: number };
        if (result && result.result === 'Created') {
          this.formSwitcher();
          this.setState({ email, password }); // TODO ? нужно ли сохранять эти данные ???
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
    const { passwordOk, error } = this.state;
    const message = 'Пароль слишком простой';

    if (!passwordOk) {
      const result = error.find((e) => e === message);
      if (!result) {
        error.push(message);
      }
      this.setState({ passwordOk: false, error });
      return false;
    }

    this.setState({ error: error.filter((e) => e !== message) });
    return true;
  };

  // Checking passwords for equality
  checkPasswordEquality = (): boolean => {
    const { password, password2, error } = this.state;
    const message = 'Пароли не совпадают';

    if (password.length !== password2.length && password !== password2) {
      const result = error.find((e) => e === message);
      if (!result) {
        error.push(message);
      }
      this.setState({ password2Ok: false, error });
      return false;
    }

    this.setState({ password2Ok: true, error: error.filter((e) => e !== message) });
    return true;
  };

  callBackPasswordStrengBar = (score: number, feedback: PasswordFeedback): void => {
    const { passwordIsComplex } = this.state;
    this.setState({ passwordOk: score >= passwordIsComplex });
  };

  render(): JSX.Element | null {
    const { formAuthorization, buttonActive, password, error, emailOk, passwordOk, password2Ok } = this.state;

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
              value={this.state.email}
              onChange={this.handleInputEmail}
            />
            <label htmlFor="fpassword">Password</label>
            <input
              type="password"
              id="fpassword"
              name="fpassword"
              className={passwordOk ? '' : 'errorValue'}
              value={this.state.password}
              onChange={this.handleInputPassword}
            />
            {!formAuthorization && (
              <PasswordStrengthBar
                password={password}
                // className="passwordStrengBar"
                className={passwordOk ? 'passwordStrengBar' : 'passwordStrengBar errorValue'}
                onChangeScore={this.callBackPasswordStrengBar}
              />
            )}
            {!formAuthorization && (
              <>
                <label htmlFor="Spassword">Repeat password</label>
                <input
                  type="password"
                  id="Spassword"
                  name="Spassword"
                  className={password2Ok ? '' : 'errorValue'}
                  value={this.state.password2}
                  onChange={this.handleInputSecondPassword}
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
