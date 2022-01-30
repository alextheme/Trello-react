/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import {
  ErrorBoundary,
  withErrorBoundary,
  ErrorBoundaryPropsWithComponent,
  useErrorHandler,
} from 'react-error-boundary';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import './common/styles/reset.scss';
import './common/styles/normalize.scss';
import './common/styles/app.scss';
import { connect } from 'react-redux';
import homeIcon from './common/img/home-icon.png';
import Home from './pages/Home/Home';
import Board from './pages/Board/Board';
import Preloader from './common/components/preloader/Preloader/Preloader';
import ErrorMessages from './common/components/errorsMessagePopap/ErrorMessages';
import LogOut from './common/components/login/logOut/Logout';
import Form from './common/components/login/logIn/FormLogIn';
import { IUserReducer } from './common/interfaces/Interfaces';
import Hero from './common/components/errorsExample/Hero';

library.add(fas);

// TODO: ErrorBoundary
// простой способ использовать <ErrorBoundary> — обернуть им любой компонент,
// который может вызвать ошибку.
// Это будет обрабатывать ошибки, выдаваемые этим компонентом и его потомками.
function ErrorFallback({ error, resetErrorBoundary }: any): JSX.Element {
  return (
    <div role="alert" style={{ borderRadius: '10px', width: 'fit-content', background: '#ffffff57', padding: '10px' }}>
      <p style={{ color: 'red' }}>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

// Вы можете реагировать на ошибки (например, для ведения журнала),
// предоставляя обратный вызов onError:
// const myErrorHandler = (error: Error, info: { componentStack: string }): void => {
//   // Что-то делаем с ошибкой
//   // например. войти в клиент регистрации ошибок здесь
//   console.log('this ERROR: ', error, ', This INFO: ', info);
// };

function App(props: IUserReducer): JSX.Element {
  const { userIsLogged } = props;

  return (
    // <ErrorBoundary
    //   FallbackComponent={ErrorFallback}
    //   onError={myErrorHandler}
    //   onReset={(): void => {
    //     console.log('sbros error"s');

    //     // сбросьте состояние вашего приложения, чтобы ошибка больше не повторялась
    //   }}
    // >

    <BrowserRouter>
      {/* <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Hero heroName="Superman" />
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Hero heroName="Airman" />
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Hero heroName="Joker" />
      </ErrorBoundary> */}

      <Preloader />
      <ErrorMessages />

      <div id="app-main-page">
        <nav id="app-main-nav">
          <Link to="/">
            <div className="logo-box">
              <img style={{ width: '100%', height: 'auto' }} className="home-page-img" src={homeIcon} alt="home" />
            </div>
          </Link>
          <Link to="/">
            <LogOut />
          </Link>
        </nav>

        <Route exact path="/" component={userIsLogged ? Home : Form} />
        <Route path="/board/:boardId" component={Board} />
        <Route path="/b/:boardId/c/:cardId" component={Board} />
      </div>
    </BrowserRouter>
  );
}

interface IMapStateToProps {
  user: IUserReducer;
}

export default connect((state: IMapStateToProps) => ({ ...state.user }))(App);
