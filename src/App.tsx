import React from 'react';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import './common/styles/reset.scss';
import './common/styles/normalize.scss';
import homeIcon from './common/img/home-icon.png'; // './common/img/home-icon.png';
import Home from './pages/Home/Home';
// import Board from './pages/Board/Board';
import BoardDnD from './pages/BoardDnD/BoardDnD';

library.add(fas);

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <div id="app-main-page">
        <nav id="app-main-nav">
          <Link to="/">
            <div
              style={{
                width: 50,
                height: 'auto',
                margin: '5px',
              }}
            >
              <img style={{ width: '100%', height: 'auto' }} className="home-page-img" src={homeIcon} alt="home" />
            </div>
          </Link>
        </nav>

        <Route exact path="/" component={Home} />
        <Route path="/board/:boardId" component={BoardDnD} />
      </div>
    </BrowserRouter>
  );
}

export default App;
