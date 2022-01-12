/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-console */
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { ICardContent, IEditableCardProps, IListContent } from '../../../../common/interfaces/Interfaces';
import EditableCard from './EditableCard';
import { deleteCard, editCard } from '../../../../store/modules/board/action-creators';
import { BoardContext, IBoardContext } from '../../boardContext';

interface TypeProps {
  cards: { [id: number]: ICardContent };
  onMouseDownForCard: (event: any) => void;
  listId: number;
  cardDelete: (boardId: number, cardId: number, listContent?: IListContent | null) => Promise<boolean>;
  cardEdit: (
    board_id: number,
    list_id: number,
    card_id: number,
    text: string,
    textType: 'title' | 'description'
  ) => Promise<boolean>;
}

interface TypeState {
  openEditCard: boolean;
  card: ICardContent;
  x: number;
  y: number;
  width: number;
}

class Card extends React.Component<TypeProps, TypeState> {
  constructor(props: TypeProps) {
    super(props);
    this.state = {
      openEditCard: false,
      card: { id: -1, position: -1, title: '', created_at: -1, description: '', users: [] },
      x: 0,
      y: 0,
      width: 0,
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  onClickOpenEditor = (card: ICardContent, event: any): void => {
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
    const { cardDelete } = this.props;
    const { updateBoard, boardId, boardData } = this.context as IBoardContext;
    const idCard =
      event.target.dataset.idCard ||
      event.target.parentElement.dataset.idCard ||
      event.target.parentElement.parentElement.dataset.idCard ||
      event.target.parentElement.parentElement.parentElement.dataset.idCard;

    console.log('del card: ', boardId, idCard);
    
    const listContent = Object.entries(boardData.lists).find(([, list]) => 
      // @ts-ignore
      Object.entries(list.cards).find(([, crd]) => `${crd.id}` === idCard)?.[1]
    )?.[1];
    
    await cardDelete(boardId, idCard, listContent);
    await updateBoard();
    this.setState({ openEditCard: false });
  };

  saveTitleCard = async (title: string, idCard: number): Promise<void> => {
    this.handlerCardTitleRename(title, idCard);
    this.closeEditor();
  };

  handlerCardTitleRename = async (title: string, idCard: number): Promise<void> => {
    const { listId, cardEdit } = this.props;
    const { updateBoard, boardId } = this.context;
    await cardEdit(boardId, listId, idCard, title, 'title');
    updateBoard();
  };

  render(): JSX.Element | null {
    const { cards, onMouseDownForCard, listId } = this.props;
    const { openEditCard, card, x, y, width } = this.state;
    const { boardId, handlerOpenDetatisCard } = this.context;
    const settingsEditCard: IEditableCardProps = {
      openEditCard,
      card,
      x,
      y,
      width,
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
            <Link
              to={`/b/${boardId}/c/${cardItem.id}`}
              key={cardItem.id}
              className="card_item"
              data-card-id={cardItem.id}
              data-list-id={listId}
              data-card-ind-pos={index}
              onMouseDown={onMouseDownForCard}
              onClick={handlerOpenDetatisCard}
            >
              <div className="card_cover">
                ({cardItem.id}) - pos: {cardItem.position}
                <h4 className="title">{cardItem.title}</h4>
                <button className="card__open-card-editor-btn" onClick={this.onClickOpenEditor.bind(this, cardItem)}>
                  <FontAwesomeIcon icon={['fas', 'pencil-alt']} />
                </button>
              </div>
            </Link>
          ))}
        {openEditCard ? <EditableCard {...settingsEditCard} /> : null}
      </>
    );
  }
}

const mapDispatchToProps = {
  cardDelete: deleteCard,
  cardEdit: editCard,
};

Card.contextType = BoardContext;

export default connect(null, mapDispatchToProps)(Card);
