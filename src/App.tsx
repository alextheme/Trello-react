/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import './App.scss';
import homeIcon from './common/img/home-icon.png';
// import Board from './pages/Board/Board';
import Home from './pages/Home/Home';

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <div style={{ height: document.documentElement.clientHeight }}>
        <nav id="app-main-nav">
          <ul>
            <li>
              <Link to="/">
                <img className="home-page-img" src={homeIcon} alt="home" />
              </Link>
              {/* <Link to="/board">Board</Link> */}
            </li>
          </ul>
        </nav>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}
