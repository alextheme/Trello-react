import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { IList } from '../../common/interfaces/Interfaces';
import './board.scss';
import List from './components/List/List';

type TParams = { board_id: string };

const Board = ({ match }: RouteComponentProps<TParams>): JSX.Element => {
  // const [state, setState] = useState({
  const [state] = useState({
    title: 'Моя тестовая доска',
    lists: [
      {
        id: 1,
        title: 'Планы',
        cards: [
          { id: 1, title: 'помыть кота' },
          { id: 2, title: 'приготовить суп' },
          { id: 3, title: 'сходить в магазин' },
        ],
      },
      { id: 2, title: 'В процессе', cards: [{ id: 4, title: 'посмотреть сериал' }] },
      {
        id: 3,
        title: 'Сделано',
        cards: [
          { id: 5, title: 'сделать домашку' },
          { id: 6, title: 'погулять с собакой' },
        ],
      },
    ],
  });

  // const handleAddNewList = (nameList: string): void => {
  //   const { lists } = state;
  //   const listIds = lists.map((elem) => elem.id);
  //   const newId = Math.max(...listIds) + 1;
  //   const newList = { id: newId, title: nameList, cards: [] };
  //   setState({ ...state, lists: [...state.lists, newList] });
  // };

  const { title, lists } = state;
  const listsCards = lists
    .map((list: IList) => (
      <li key={list.id}>
        <List id={list.id} title={list.title} cards={list.cards} />
      </li>
    ))
    .concat([
      <li className="board__add-list-btn" key="btn">
        <button>
          <span> + </span> Добавить список
        </button>
      </li>,
    ]);
  //
  //
  return (
    <div className="board">
      <h2 className="board__title">{`${title}, id: ${match.params.board_id}`}</h2>
      <div className="boards__container">
        <ul className="boards__list">{listsCards}</ul>
      </div>
    </div>
  );
};

export default Board;
