import React from 'react';
import './list.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import Card from '../Card/Card';
import AddCard from '../AddCard/AddCard';
import { deleteList, getBoard } from '../../../../store/modules/board/actions';
import { IData } from '../../../../common/interfaces/Interfaces';

interface TypeProps {
  boardId: string;
  id: number;
  title: string;
  cards: IData[];
  position: number;
  getBoard: any;
}

function List({ boardId, id, title, cards, position, ...p }: TypeProps): JSX.Element {
  const onClickHandleButtonDeleteList = async (): Promise<void> => {
    await deleteList(boardId, id);
    p.getBoard(boardId);
  };

  let listCardsRender;

  const button = [
    <li className="lists-element" key="btn">
      <AddCard boardId={boardId} listId={id} />
    </li>,
  ];

  if (Object.keys(cards).length) {
    listCardsRender = Object.keys(cards)
      .map((e) => {
        // @ts-ignore
        const elem = cards[e];
        return (
          <li key={elem.id} className="lists-element">
            <Card title={elem.title} id={elem.id} boardId={boardId} />
          </li>
        );
      })
      .concat(button);
  } else {
    listCardsRender = button;
  }

  //
  return (
    // eslint-disable-next-line react/no-this-in-sfc
    <div className="lists" data-list_id={id}>
      <div className="lists-header">
        <div className="list__title-container">
          <h2 className="list-title">{title}</h2>
          <p className="afasdf">{id}</p>
          <p className="afasdf">{position}</p>
        </div>
        <span className="lists__delete-btn" onClick={onClickHandleButtonDeleteList}>
          <FontAwesomeIcon icon="ellipsis-h" />
        </span>
      </div>
      <ul className="lists-list">{listCardsRender}</ul>
      <br />
    </div>
  );
}

export default connect(null, { getBoard })(List);
