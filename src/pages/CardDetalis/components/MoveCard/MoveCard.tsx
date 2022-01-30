/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './MoveCard.scss';
import { IFuncType, PopupCardDialogProps, PopupCardDialogState } from './MoveCard.props';
import { IBoardContent, IBoards, IListContent } from '../../../../common/interfaces/Interfaces';
import instance from '../../../../api/request';
import { Selection } from '../Selection/Selection';
import HeaderPopupCardDialog from '../HeaderPopupCardDialog/HeaderPopupCardDialog';
import { Button } from '../Button/Button';
import { moveCardBetweenLists, moveCardOneList } from './functionsMoveCard/funcMoveCard';
import {
  createNewCardWithMovement,
  deleteCard,
  editCard,
  getBoard,
  movedCards,
} from '../../../../store/modules/board/action-creators';
import { BoardContext } from '../../../Board/boardContext';

class MoveCard extends Component<PopupCardDialogProps & IFuncType, PopupCardDialogState> {
  constructor(props: PopupCardDialogProps & IFuncType) {
    super(props);

    const { src } = this.props;

    this.state = {
      boardId: src.boardId,
      listId: src.listId,
      positionCard: src.positionCard,
      boardsList: null,
      boardData: src.boardData,
    };
  }

  async componentDidMount(): Promise<void> {
    const boards = await this.getBoardsList();
    if (boards) this.setState({ boardsList: boards });
  }

  getBoardsList = async (): Promise<IBoards | null> => {
    try {
      const data = (await instance.get('/board')) as IBoards;
      return data;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
      return null;
    }
  };

  getBoardData = async (boardId: number): Promise<IBoardContent | null> => {
    try {
      const data: IBoardContent = await instance.get(`/board/${boardId}`);
      return data;
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.log('Error update data: ', e);
      return null;
    }
  };

  /* Board */
  handlerOnChangeSelectBoard = async (e: any): Promise<void> => {
    const boardId = +e.target.value;
    const currentValueSelectBoard = await this.getBoardData(boardId);

    if (currentValueSelectBoard) {
      const { src } = this.props;
      const firstList = Object.entries(currentValueSelectBoard.lists).find(
        ([, l]) => l.position === 1
      )?.[1] as IListContent;
      if (!firstList) return;
      const cards = Object.entries(firstList.cards).sort(([, a], [, b]) => a.position - b.position);

      // Is there a movable card on this board? ...
      const movableCard = cards.find(([, c]) => c.id === src.cardId)?.[1];
      // ... if there is, save its Id, if not, save -1
      const positionCard = movableCard ? src.positionCard : cards.length + 1;

      this.setState((state) => ({
        ...state,
        boardId,
        listId: firstList.id,
        positionCard,
        boardData: currentValueSelectBoard,
      }));
    }
  };

  /* List */
  handlerOnChangeSelectList = (e: any): void => {
    const listId = +e.target.value;
    const { src } = this.props;
    const { boardData } = this.state;

    const list = boardData.lists[listId];
    const cards = Object.entries(list.cards).sort(([, a], [, b]) => a.position - b.position);

    // Is there a movable card on this board? ...
    const movableCard = cards.find(([, c]) => c.id === src.cardId)?.[1];
    // ... if there is, save its Id, if not, save -1
    const positionCard = movableCard ? src.positionCard : cards.length + 1;

    this.setState((state) => ({ ...state, listId, positionCard }));
  };

  /* Card */
  handlerOnChangeSelectCard = (e: any): void => {
    const positionCard = +e.target.value;
    this.setState((state) => ({ ...state, positionCard }));
  };

  /* MOVE CARD */
  handlerMoveCard = async (): Promise<void> => {
    const { src, closePopup } = this.props;
    const { boardId, listId, boardData, positionCard } = this.state;

    if (src.boardId === boardId && src.listId === listId && src.positionCard === positionCard) return;

    const { moveCards } = this.props;
    const { updateBoard } = this.context;

    // Move in one list
    if (src.listId === listId) {
      const newCardPosition = moveCardOneList({
        card: src.cardId,
        srcList: src.listId,
        srcData: src.boardData,
        positionCard,
      });
      await moveCards(src.boardId, newCardPosition);
      await updateBoard();
      closePopup();

      // Move between different lists in one board
    } else if (src.boardId === boardId) {
      const newCardPosition = moveCardBetweenLists({
        card: src.cardId,
        srcList: src.listId,
        srcData: src.boardData,
        destList: listId,
        positionCard,
      });
      await moveCards(src.boardId, newCardPosition);
      await updateBoard();
      closePopup();

      // Move between different lists & board
    } else {
      // TODO - разобраться с редактированием карточки Title & Description
      const { deleteCrd, createCrd, closeCardDialog } = this.props;
      const card = { ...src.boardData.lists[src.listId].cards[src.cardId] };
      await deleteCrd(src.boardId, src.cardId, src.boardData.lists[src.listId]);
      await createCrd(boardId, boardData.lists[listId], positionCard, card.title);
      await updateBoard();
      closeCardDialog();
    }
  };

  render(): JSX.Element | null {
    const { src } = this.props;
    const { boardId, listId, positionCard, boardsList, boardData } = this.state;

    if (!boardsList || !boardData) return null;

    return (
      <div className="popup-card-dialog">
        {/* HEADER */}
        <HeaderPopupCardDialog title="Перемещение карточки" classname="moveCardInTitleCardBox" />

        <h5 className="label-selections-box">Выберите колонку</h5>
        {/* BOARDS */}
        <Selection
          onChange={this.handlerOnChangeSelectBoard}
          className="section-select-board"
          data={{
            key: 'boards',
            src,
            valueId: boardId,
            value: boardsList,
          }}
        />

        <div className="box-sections-select-list-and-card">
          {/* LISTS */}
          <Selection
            onChange={this.handlerOnChangeSelectList}
            className="section-select-list"
            data={{
              key: 'lists',
              src,
              valueId: listId,
              value: boardData,
            }}
          />

          {/* CARDS */}
          <Selection
            onChange={this.handlerOnChangeSelectCard}
            className="section-select-card"
            data={{
              key: 'cards',
              src,
              boardId,
              listId,
              positionCard,
              numberCards: Object.keys(boardData.lists[listId].cards).length,
            }}
          />
        </div>

        {/* BUTTON */}
        <Button appearance="blue" onClick={this.handlerMoveCard} className="button-move-card">
          Move
        </Button>
      </div>
    );
  }
}

const mapDispatchToProps = {
  deleteCrd: deleteCard,
  createCrd: createNewCardWithMovement, // addCard,
  editCrd: editCard,
  moveCards: movedCards,
  update: getBoard,
};

MoveCard.contextType = BoardContext;

export default connect(null, mapDispatchToProps)(MoveCard);
