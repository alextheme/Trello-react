import React, { useState } from 'react';
import './home.scss';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
// RouteComponentProps
import Board from '../Board/Board';
import AddBoard from './components/Board/AddBoard';

const Home = (): JSX.Element => {
  const [state, setState] = useState({
    boards: [
      { id: 1, title: 'покупки' },
      { id: 2, title: 'подготовка к свадьбе' },
      { id: 3, title: 'разработка интернет-магазина' },
      { id: 4, title: 'курс по продвижению в соцсетях' },
      { id: 5, title: 'курс фронтэнда' },
    ],
  });

  const handleAddNewBoard = (nameBoard: string): void => {
    const { boards } = state;
    const listId = boards.map((elem) => elem.id);
    const newId = Math.max(...listId) + 1;
    const newBoard = { id: newId, title: nameBoard };
    setState({ ...state, boards: [...state.boards, newBoard] });
  };

  const { url } = useRouteMatch();

  const li = state.boards
    .map((board: { id: number; title: string }) => (
      <li className="home-boards__list-element" key={board.id}>
        <Link to={`${url}/${board.id}`}>
          <span className="boards__list-element-title">{board.title}</span>
        </Link>
      </li>
    ))
    .concat([
      <li className="home-boards__list-element btn" key="btn">
        <AddBoard onClick={handleAddNewBoard} />
      </li>,
    ]);

  return (
    <div className="home-boards">
      <div className="home-boards__wrapper">
        <Switch>
          <Route exact path={url}>
            <ul className="home-boards__list">{li}</ul>
          </Route>
          <Route path={`${url}/:board_id`} component={Board} />
          <Route path="*">
            <p>Page not found (Home) </p>
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default Home;
