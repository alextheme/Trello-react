/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import './list.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import EditableTitleList from './EditableTitleList';
import Card from '../Card/Card';
import { deleteCard, deleteList, renameTitleCard } from '../../../../store/modules/board/actions';
// import { IData } from '../../../../common/interfaces/Interfaces';
import EditableCard from '../Card/EditableCard';
import AddCard from '../Card/AddCard';

// interface TypeProps {
//   boardId: string;
//   id: number;
//   title: string;
//   cards: IData[];
//   position: number;
//   updateBoard: any;
// }

// @ts-ignore
function List({ boardId, index, list, updateBoard }: any): JSX.Element {
  const [settingsEditCard, setSettingsEditCard] = useState({});
  const [openEditCard, setOpenEditCard] = useState(false);
  const [heightListContainer, setHeightListContainer] = useState(window.innerHeight);

  useEffect(() => {
    const boardListConainer = document.getElementById('board_lists_container');

    if (boardListConainer) {
      const top = boardListConainer?.getBoundingClientRect().top || 0;
      boardListConainer.style.height = `${window.innerHeight - top}px`;
      const height = window.innerHeight - top;
      setHeightListContainer(height);
    }
  });

  const onClickDeleteList = async (): Promise<void> => {
    await deleteList(+boardId, list.id);
    updateBoard();
  };

  const onClickDeleteCard = async (e: any): Promise<void> => {
    const idCard =
      e.target.dataset.idCard ||
      e.target.parentElement.dataset.idCard ||
      e.target.parentElement.parentElement.dataset.idCard ||
      e.target.parentElement.parentElement.parentElement.dataset.idCard;
    await deleteCard(boardId, idCard);
    updateBoard();
    setOpenEditCard(false);
  };

  const onClickClosedEditCard = (): void => {
    setOpenEditCard(false);
  };

  const handlerClickClosedEditCard = (e: any): void => {
    let canBeClosed = true;
    ['.editor-card__title', '.editor-card__buttons'].forEach((cls) => {
      if (e.target.closest(cls)) canBeClosed = false;
    });
    if (canBeClosed) onClickClosedEditCard();
  };

  const saveTitleCard = async (titleCard: string, idCard: string): Promise<void> => {
    await renameTitleCard(boardId, idCard, { title: titleCard, list_id: `${list.id}` });
    updateBoard();
    onClickClosedEditCard();
  };

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const onClickOpenEditCard = ({ openedEditCard, x, y, boardId, cardId, title }): void => {
    setSettingsEditCard({
      x,
      y,
      boardId,
      cardId,
      title,
      saveTitle: saveTitleCard,
      deleteCard: onClickDeleteCard,
      closeEditor: onClickClosedEditCard,
      closeBGEditor: handlerClickClosedEditCard,
    });
    setOpenEditCard(openedEditCard);
  };

  // return
  return (
    <Draggable draggableId={`${list.id}`} index={index}>
      {(provided): JSX.Element => (
        <div
          className="list-container"
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          style={{ maxHeight: heightListContainer }}
          {...provided.draggableProps}
        >
          <Droppable droppableId={`${list.id}`} type="task">
            {(provided, snapshot): JSX.Element => (
              <div className="list-item" ref={provided.innerRef} {...provided.droppableProps}>
                {/* Edit Card */}
                {openEditCard ? <EditableCard {...settingsEditCard} /> : null}
                <div className="list_header">
                  <EditableTitleList
                    boardId={boardId}
                    listId={list.id}
                    titleList={list.title}
                    updateBoard={updateBoard}
                  />
                  <p>{list.id}</p>
                  <span className="list__delete-btn" onClick={onClickDeleteList}>
                    <FontAwesomeIcon icon={['fas', 'ellipsis-h']} />
                  </span>
                </div>

                <div
                  id={`list-card-wrapper-${list.id}`}
                  className="list-card-wrapper"
                  style={{
                    background: snapshot.isDraggingOver ? 'lightgreen' : '',
                    maxHeight: heightListContainer - 44,
                  }}
                >
                  <div>
                    {
                      /* Card */
                      Object.entries(list.cards)
                        .sort((a: any, b: any) => a[1].position - b[1].position)
                        // eslint-disable-next-line @typescript-eslint/no-shadow
                        .map(([id, card], index) => (
                          <Card
                            key={id}
                            boardId={boardId}
                            card={card}
                            index={index}
                            onClickOpenEditCard={onClickOpenEditCard}
                          />
                        ))
                    }
                  </div>
                  {/* </div> */}
                  <AddCard
                    addCardInputId={`add-card__input-field-${list.id}`}
                    boardId={boardId}
                    listId={list.id}
                    countCards={Object.keys(list.cards).length}
                    updateBoard={updateBoard}
                  />
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}

export default List;
