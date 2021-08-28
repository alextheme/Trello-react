import React from 'react';
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';
import './App.scss';
import Board from './pages/Board/Board';

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <ul id="main-nav">
            <li>
              <NavLink to="/" activeClassName="home-page albor">
                <span className="home-page-img" />
              </NavLink>
            </li>
            <li>
              <NavLink to="/board">Board</NavLink>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/board">
            <Board />
          </Route>
          <Route path="/">
            <p>HOME</p>
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}
