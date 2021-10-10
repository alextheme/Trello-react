/* esli nt-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-console */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ICard } from '../../../../common/interfaces/Interfaces';
import EditableCard from './EditableCard';
import { deleteCard, renameTitleCard } from '../../../../store/modules/board/actions';

interface TypeProps {
  cards: { [id: number]: ICard };
  onMouseDownForCard: (event: any) => void;
  boardId: number;
  listId: number;
  updateBoard: () => void;
}

interface TypeState {
  openEditCard: boolean;
  card: ICard | null;
  x: number;
  y: number;
  width: number;
}

class Card extends React.Component<TypeProps, TypeState> {
  constructor(props: TypeProps) {
    super(props);
    this.state = {
      openEditCard: false,
      card: null,
      x: 0,
      y: 0,
      width: 0,
    };
  }

  componentDidMount(): void {}

  componentWillUnmount(): void {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  onClickOpenEditor = (card: ICard, event: any): void => {
    const c = event.target.closest('.card_item').getBoundingClientRect();
    this.setState({ openEditCard: true, width: c.width, x: c.left, y: c.top, card });
  };

  closeEditor = (): void => {
    this.setState({ openEditCard: false });
  };

  handlerClickClosedEditCard = (event: { target: { closest: (arg0: string) => any } }): void => {
    let canBeClosed = true;
    ['.editor-card__title', '.editor-card__buttons'].forEach((cls) => {
      if (event.target.closest(cls)) canBeClosed = false;
    });
    if (canBeClosed) this.closeEditor();
  };

  onClickDeleteCard = async (event: {
    target: {
      dataset: { idCard: any };
      parentElement: {
        dataset: { idCard: any };
        parentElement: { dataset: { idCard: any }; parentElement: { dataset: { idCard: any } } };
      };
    };
  }): Promise<void> => {
    const { updateBoard, boardId } = this.props;
    const idCard =
      event.target.dataset.idCard ||
      event.target.parentElement.dataset.idCard ||
      event.target.parentElement.parentElement.dataset.idCard ||
      event.target.parentElement.parentElement.parentElement.dataset.idCard;
    await deleteCard(boardId, idCard);
    updateBoard();
    this.setState({ openEditCard: false });
  };

  saveTitleCard = async (titleCard: string, idCard: string): Promise<void> => {
    const { updateBoard, boardId, listId } = this.props;
    console.log('84: ', titleCard, boardId, idCard);

    await renameTitleCard(boardId, idCard, { title: titleCard, list_id: listId });
    updateBoard();
    this.closeEditor();
  };

  render(): JSX.Element | null {
    const { cards, onMouseDownForCard, boardId } = this.props;
    const { openEditCard, card, x, y, width } = this.state;
    const settingsEditCard = {
      openEditCard,
      card,
      x,
      y,
      width,
      boardId,
      closeEditor: this.closeEditor,
      closeBGEditor: this.handlerClickClosedEditCard,
      deleteCard: this.onClickDeleteCard,
      saveTitle: this.saveTitleCard,
    };

    return (
      <>
        {Object.entries(cards)
          .sort((a, b) => a[1].position - b[1].position)
          .map(([, cardItem], index) => (
            <a
              key={cardItem.id}
              className="card_item"
              data-card-id={cardItem.id}
              data-card-ind-pos={index}
              onMouseDown={onMouseDownForCard}
            >
              <div className="card_detalis">
                {/* ({cardItem.id}) - pos: {cardItem.position} */}
                <h4 className="title">{cardItem.title}</h4>
                <button className="card__open-card-editor-btn" onClick={this.onClickOpenEditor.bind(this, cardItem)}>
                  <FontAwesomeIcon icon={['fas', 'pencil-alt']} />
                </button>
              </div>
            </a>
          ))}
        {openEditCard ? <EditableCard {...settingsEditCard} /> : null}
      </>
    );
  }
}

export default Card;
