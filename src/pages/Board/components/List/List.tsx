import React from 'react';
import './list.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import Card from '../Card/Card';
import AddCard from '../AddCard/AddCard';
import { deleteList, getBoard } from '../../../../store/modules/board/actions';

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function List({ boardId, listId, listTitle, listCards, ...rest }): JSX.Element {
  const onClickHandleButtonDeleteList = async (): Promise<void> => {
    await deleteList(boardId, listId);
    rest.getBoard(boardId);
  };

  let listCardsRender;

  const button = [
    <li className="lists-element" key="btn">
      <AddCard boardId={boardId} listId={listId} />
    </li>,
  ];

  if (Object.keys(listCards).length) {
    listCardsRender = Object.keys(listCards)
      .map((e) => {
        const elem = listCards[e];
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
    <div className="lists" data-list_id={listId}>
      <div className="lists-header">
        <h2 className="lists-title">{`${listTitle} (${listId})`}</h2>
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
