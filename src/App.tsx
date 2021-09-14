import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import './App.scss';
import homeIcon from './common/img/home-icon.png';
import Home from './pages/Home/Home';
import Board from './pages/Board/Board';

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <div id="app-main-page">
        <nav id="app-main-nav">
          <Link to="/">
            <img className="home-page-img" src={homeIcon} alt="home" />
          </Link>
        </nav>

        <Route exact path="/" component={Home} />
        <Route path="/board/:boardId" component={Board} />
      </div>
    </BrowserRouter>
  );
}

export default App;
