/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prettier/prettier */
/* eslint-disable no-alert */
/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-console */
/* eslint-disable react/no-unused-state */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-undef */
import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';
import { connect } from 'react-redux';
import styles from './MoveCard.module.scss';
import { IFuncType, PopupCardDialogProps, PopupCardDialogState } from './MoveCard.props';
import { IBoardContent, IBoardCover, IBoards, IListContent, ILists } from '../../../../common/interfaces/Interfaces';
import instance from '../../../../api/request';
import { Selection } from '../partsComponent/Selection/Selection';
import HeaderPopupCardDialog from '../partsComponent/HeaderPopupCardDialog/HeaderPopupCardDialog';
import { Button } from '../partsComponent/Button/Button';
import { moveCardBetweenLists, moveCardOneList } from './functionsCard/funcMoveCard';
import {
  addCard,
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
      // console.log('boards: ', data);
      return data;
    } catch (error: any) {
      console.log(error);
      return null;
    }
  };

  getBoardData = async (boardId: number): Promise<IBoardContent | null> => {
    try {
      const data: IBoardContent = await instance.get(`/board/${boardId}`);
      return data;
    } catch (e: any) {
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
      const firstList = Object.entries(currentValueSelectBoard.lists).find(([, l]) => l.position === 1)?.[1] as IListContent;
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
    const { src, ...props } = this.props;
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

      // Move between different lists & board
    } else {
      // TODO - разобраться с редактированием карточки Title & Description
      const { deleteCrd, createCrd, editCrd, closeCardDialog } = this.props;
      const card = { ...src.boardData.lists[src.listId].cards[src.cardId] };
      await deleteCrd(src.boardId, src.cardId, src.boardData.lists[src.listId]);
      const resultCreateCard = await createCrd(boardId, boardData.lists[listId], positionCard, card.title);
      if (resultCreateCard) {
        console.log('1');
        setTimeout(async () => {
          console.log('2');
          await updateBoard();
          await editCard(boardId, listId, resultCreateCard, card.description, 'description');
        }, 5000);
        console.log('3');
      }
      await updateBoard();
      closeCardDialog();
    }
  };

  render(): JSX.Element | null {
    const { src } = this.props;
    const { boardId, listId, positionCard, boardsList, boardData } = this.state;

    if (!boardsList || !boardData) return null;

    return (
      <div className={cn(styles.popupCardDialog)}>
        {/* HEADER */}
        <HeaderPopupCardDialog title="Перемещение карточки" classname="moveCardInTitleCardBox" />

        {/* BOARDS */}
        <Selection
          onChange={this.handlerOnChangeSelectBoard}
          data={{
            key: 'boards',
            src,
            valueId: boardId,
            value: boardsList,
          }}
        />

        {/* LISTS */}
        <Selection
          onChange={this.handlerOnChangeSelectList}
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
          data={{
            key: 'cards',
            src,
            boardId,
            listId,
            positionCard,
            numberCards: Object.keys(boardData.lists[listId].cards).length,
          }}
        />

        {/* BUTTON */}
        <Button appearance="blue" onClick={this.handlerMoveCard}>
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
