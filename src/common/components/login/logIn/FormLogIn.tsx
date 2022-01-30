import React from 'react';
import { connect } from 'react-redux';
import PasswordStrengthBar from 'react-password-strength-bar';
import { Rainbow } from 'common/components/preloader/Rainbow/Rainbow';
import { authorization, registration } from '../../../../store/modules/user/action-creators';
import './formLogIn.scss';
import ButtonFormLogin from './ButtonFormLogin/ButtonFormLogin';

interface PropsType {
  authorizationUser: (email: string, password: string) => Promise<void>;
  registrationUser: (email: string, password: string) => Promise<boolean>;
  logging: boolean;
}

type StateType = {
  formAuthorization: boolean;
  email: string;
  emailOk: boolean;
  fPassword: string;
  fPasswordIsComplex: number;
  fPasswordOk: boolean;
  sPassword: string;
  sPpasswordOk: boolean;
  error: string[];
  createUserSuccess: boolean;
};

class FormAuthorization extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      formAuthorization: !0,
      email: '', // abc@mail.com
      emailOk: !1,
      fPassword: '', // abcmailcom
      fPasswordIsComplex: 3,
      fPasswordOk: !1,
      sPassword: '', // abcmailcom
      sPpasswordOk: !1,
      error: [],
      createUserSuccess: !1,
    };
    this.formSwitcher = this.formSwitcher.bind(this);
    this.handleUserLogIn = this.handleUserLogIn.bind(this);
    this.handleUserRegistration = this.handleUserRegistration.bind(this);
    this.callBackPasswordStrengBar = this.callBackPasswordStrengBar.bind(this);
    this.handleInputOnChange = this.handleInputOnChange.bind(this);
  }

  handleInputOnChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const {
      target: { id, value },
    } = e;

    // email fPassword sPassword
    this.setState((state) => ({ ...state, [id]: value }));

    if (id === 'email') {
      this.validateEmail(value);
    }

    if (id === 'fPassword') {
      this.validateFirstPassword(value);
    }

    if (id === 'sPassword') {
      this.validateSecondPassword(value);
    }
  }

  // Authorization
  async handleUserLogIn(event: React.MouseEvent<HTMLInputElement>): Promise<void> {
    event.preventDefault();

    const { formAuthorization, emailOk, fPasswordOk, sPpasswordOk } = this.state;
    const btnActive = formAuthorization ? emailOk && fPasswordOk : emailOk && fPasswordOk && sPpasswordOk;

    if (btnActive) {
      const { authorizationUser } = this.props;
      const { email, fPassword } = this.state;
      authorizationUser(email, fPassword);
    }
  }

  // Registration
  async handleUserRegistration(event: React.MouseEvent<HTMLInputElement>): Promise<void> {
    event.preventDefault();

    const { formAuthorization, emailOk, fPasswordOk, sPpasswordOk } = this.state;
    const btnActive = formAuthorization ? emailOk && fPasswordOk : emailOk && fPasswordOk && sPpasswordOk;

    if (btnActive) {
      const { registrationUser } = this.props;
      const { email, fPassword } = this.state;

      const resRegg = await registrationUser(email, fPassword);

      if (resRegg) {
        this.setState({ createUserSuccess: true, email: '', fPassword: '', sPassword: '' });
        this.formSwitcher();
      }
    }
  }

  /*
   * Valiation Email, Password, Password2
   */
  // validetion Email
  validateEmail = (email: string): void => {
    const pattern = /^[\w\-.]+@[\w-]+\.[a-z]{2,4}$/i;
    this.setState({ emailOk: pattern.test(email) });
  };

  // validetion Email
  validateFirstPassword = (password: string): void => {
    this.setState({ fPasswordOk: password !== '' });
  };

  // validetion Email
  validateSecondPassword = (password: string): void => {
    const { fPassword } = this.state;
    this.setState({ sPpasswordOk: password === fPassword });
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
  /*
   * end function validations
   */

  callBackPasswordStrengBar = (score: number): void => {
    const { fPasswordIsComplex } = this.state;
    this.setState({ fPasswordOk: score >= fPasswordIsComplex });
  };

  formSwitcher = (): void => {
    this.setState((state) => ({ formAuthorization: !state.formAuthorization }));
  };

  handleCloseInfoSuccessCreateUser = (): void => {
    this.setState({ createUserSuccess: false });
  };

  render(): JSX.Element | null {
    const {
      formAuthorization,
      fPassword,
      fPasswordOk,
      email,
      emailOk,
      error,
      sPassword,
      sPpasswordOk,
      createUserSuccess,
    } = this.state;
    const { logging } = this.props;

    const titleForm = formAuthorization ? 'authorization' : 'registration';
    const textSuccessCreateUser = 'Вы успешно зарегистрировались! Авторизируйтесь и наслаждайтесь работой';

    return (
      <div className={`${titleForm}-box`}>
        {logging && <Rainbow />}
        {createUserSuccess && (
          <div className="success-create-user">
            <span>{textSuccessCreateUser}</span>
            <span className="button" onClick={this.handleCloseInfoSuccessCreateUser}>
              x
            </span>
          </div>
        )}
        <div className={`${titleForm}-container`}>
          <h4 className={`${titleForm}-title`}>{titleForm}</h4>

          <form className={`${titleForm}-form`}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              // value={email}
              defaultValue={email}
              onChange={this.handleInputOnChange}
              autoComplete="section-email"
            />

            <label htmlFor="fPassword">Password</label>
            <input
              type="password"
              id="fPassword"
              name="fPassword"
              // value={fPassword}
              defaultValue={fPassword}
              onChange={this.handleInputOnChange}
              autoComplete="section-first-password"
            />

            {!formAuthorization && (
              <>
                <PasswordStrengthBar
                  password={fPassword}
                  className={fPasswordOk ? 'passwordStrengBar' : 'passwordStrengBar errorValue'}
                  onChangeScore={this.callBackPasswordStrengBar}
                  scoreWords={['пусто', 'слабовато', 'нужно посложнее', 'сойдет', 'молоток!']}
                  shortScoreWord="это дыра"
                />

                <label htmlFor="sPassword">Repeat password</label>
                <input
                  type="password"
                  id="sPassword"
                  name="sPassword"
                  defaultValue={sPassword}
                  onChange={this.handleInputOnChange}
                  autoComplete="section-second-password"
                />

                <div className="textError">
                  {error.map((m, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <p key={i}>{m}</p>
                  ))}
                </div>
              </>
            )}

            <ButtonFormLogin
              formAuthorization={formAuthorization}
              handleUserLogIn={this.handleUserLogIn}
              handleUserRegistration={this.handleUserRegistration}
              titleForm={titleForm}
              buttonActive={formAuthorization ? emailOk && fPasswordOk : emailOk && fPasswordOk && sPpasswordOk}
            />

            <p className={`${titleForm}-already`}>
              {formAuthorization ? 'First time with us?' : 'Already have an account?'}{' '}
              <span onClick={this.formSwitcher}>{formAuthorization ? 'Register now' : 'Sign in'}</span>
            </p>
          </form>
        </div>
      </div>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapStateToProps = (state: any): any => ({ ...state.load });

export default connect(mapStateToProps, { authorizationUser: authorization, registrationUser: registration })(
  FormAuthorization
);
