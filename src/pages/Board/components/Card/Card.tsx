/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any, no-console */
import React from 'react';
import './card.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Draggable } from 'react-beautiful-dnd';

interface TypeProps {
  boardId: string;
  id: number;
  title: string;
  position: number;
  onClickOpenEditCard: any;
  index: number;
  cardId: string;
}

const Card = (props: TypeProps | any): JSX.Element => {
  const { boardId, card, index, onClickOpenEditCard } = props;

  const onClickOpenEditor = (event: any): void => {
    // @ts-ignore
    const c = event.target.closest('.parent-card').getBoundingClientRect();
    onClickOpenEditCard({ openedEditCard: true, x: c.left, y: c.top, boardId, cardId: card.id, title: card.title });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getStyle = (style: any, snapshot: any): any => {
    if (!snapshot.isDropAnimating) {
      return style;
    }
    const { moveTo, curve, duration } = snapshot.dropAnimation;
    console.log('sd: ', moveTo, curve, duration);
    console.log('s: ', snapshot);
    return {
      ...style,
      transform: snapshot.isDragging ? 'rotate(0)' : 'rotate(10deg)',
      userSelect: 'none',
      // backgroundColor: snapshot.draggingOver ? '#d5d5d5' : '',
      backgroundColor: snapshot.isDragging ? 'lightGreen' : 'red',
    };
  };
  //
  return (
    <Draggable draggableId={`${card.id}`} key={card.id} index={index}>
      {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        (provided, snapshot): JSX.Element => (
          <div className="shadow-card" /* id={`card-item-id-${card.id}`} */>
            <div
              className="parent-card"
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={{
                ...provided.draggableProps.style,
                userSelect: 'none',
                backgroundColor: snapshot.isDragging ? 'lightGreen' : 'lightBlue',
              }}
            >
              <div className="card-item">
                <p className="card__title">{`${card.title} (${card.id}) поз: ${card.position}`}</p>
                <button className="card__open-card-editor-btn no-moved" onClick={onClickOpenEditor}>
                  <FontAwesomeIcon icon={['fas', 'pencil-alt']} />
                </button>
              </div>
            </div>
          </div>
        )
      }
    </Draggable>
  );
};

export default Card;
