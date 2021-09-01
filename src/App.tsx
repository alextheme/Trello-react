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
            </li>
            <li>
              <Link to="/board">
                <span>Boards</span>
              </Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route exact path="/">
            <h1>&#127968;</h1>
          </Route>
          <Route path="/board">
            <Home />
          </Route>
          <Route path="*">"Page Not Found :-( (App.tsx)"</Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}
