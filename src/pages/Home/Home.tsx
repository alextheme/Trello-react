/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/lines-between-class-members */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable spaced-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import './home.scss';
import { Link, Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
// import Board from '../Board/Board';
import ButtonCreateNewBoard from './components/Buttons/ButtonCreateNewBoard';

const Home = (): JSX.Element => {
  const [state] = useState({
    boards: [
      { id: 1, title: 'покупки' },
      { id: 2, title: 'подготовка к свадьбе' },
      { id: 3, title: 'разработка интернет-магазина' },
      { id: 4, title: 'курс по продвижению в соцсетях' },
    ],
  });
  const { url } = useRouteMatch();
  console.log(url);
  console.log(useParams());

  const getRandomNumber = (num: number): number => Math.round(Math.random() * num);
  const getRGB = (): string => `rgb(${getRandomNumber(100)}, ${getRandomNumber(100)}, ${getRandomNumber(100)})`;

  const { boards } = state;
  const li = boards
    .map((board: { id: number; title: string }) => (
      <li
        style={{ backgroundColor: getRGB() }}
        className="home-boards__list-element"
        id={`board_id-${board.id}`}
        key={board.id}
      >
        <Link to={`/board/${board.id}`}>
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
        <ul className="home-boards__list">{li}</ul>
        <Switch>
          <Route path="/board/:board_id">board 1</Route>
        </Switch>
      </div>
    </div>
  );
};

export default Home;
