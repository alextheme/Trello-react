import React from 'react';
import { BrowserRouter, Link, Route } from 'react-router-dom';
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

library.add(fas);

// TODO: ErrorBoundary

function App(props: IUserReducer): JSX.Element {
  const { userIsLogged } = props;

  return (
    <BrowserRouter>
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
