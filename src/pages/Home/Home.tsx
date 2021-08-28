/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable spaced-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import './home.scss';
import { Link, Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import Board from '../Board/Board';
import ButtonCreateNewBoard from './components/Buttons/ButtonCreateNewBoard';

const Home = (): JSX.Element => {
  const [state] = useState({
    boards: [
      { id: 1, title: 'покупки' },
      { id: 2, title: 'подготовка к свадьбе' },
      { id: 3, title: 'разработка интернет-магазина' },
      { id: 4, title: 'курс по продвижению в соцсетях' },
      { id: 5, title: 'курс фронтэнда' },
    ],
  });
  const { url } = useRouteMatch();
  console.log(url);

  const { boards } = state;
  const li = boards
    .map((board: { id: number; title: string }) => (
      <li className="home-boards__list-element" key={board.id}>
        <Link to={`${url}board/${board.id}`}>
          <span className="boards__list-element-title">{board.title}</span>
        </Link>
      </li>
    ))
    .concat([
      <li className="home-boards__list-element btn" key="btn">
        <ButtonCreateNewBoard text="+ Создать доску" />
      </li>,
    ]);

  return (
    <div className="home-boards">
      <div className="home-boards__wrapper">
        <Switch>
          <Route exact path={`${url}`}>
            <ul className="home-boards__list">{li}</ul>
          </Route>
          <Route path={`${url}board/:board_id`}>
            <Board />
          </Route>
          <Route path="*">
            <p>Page not found (Home) </p>
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default Home;
