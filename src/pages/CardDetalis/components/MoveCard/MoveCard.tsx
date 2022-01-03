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
import { IBoardContent, IBoardCover, IBoards } from '../../../../common/interfaces/Interfaces';
import instance from '../../../../api/request';
import { Selection } from '../partsComponent/Selection/Selection';
import HeaderPopupCardDialog from '../partsComponent/HeaderPopupCardDialog/HeaderPopupCardDialog';
import { Button } from '../partsComponent/Button/Button';
import { moveCardBetweenDesks, moveCardBetweenLists, moveCardOneList } from './functionsCard/funcMoveCard';
import {
  addCard,
  deleteCard,
  editDescriptionCard,
  getBoard,
  movedCards,
} from '../../../../store/modules/board/action-creators';

class MoveCard extends Component<PopupCardDialogProps & IFuncType, PopupCardDialogState> {
  constructor(props: PopupCardDialogProps & IFuncType) {
    super(props);

    const { startingValues } = this.props;

    this.state = {
      boardId: startingValues.boardId,
      listId: startingValues.listId,
      // cardId = ID of the card in place of which the movable card will be
      cardId: startingValues.cardId,
      boardsList: null,
      currentBoardData: startingValues.boardData,
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
      // console.log('data one board: ', data);
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
      const {
        startingValues: { cardId: movableCardId },
      } = this.props;

      const firstList = Object.entries(currentValueSelectBoard.lists).find(([, l]) => l.position === 1)?.[1];
      if (!firstList) return;
      const cards = Object.entries(firstList.cards).sort(([, a], [, b]) => a.position - b.position);

      // Is there a movable card on this board? ...
      const movableCard = cards.find(([, c]) => c.id === movableCardId)?.[1];
      // ... if there is, save its Id, if not, save -1
      const cardId = movableCard?.id || -1;

      this.setState((state) => ({
        ...state,
        boardId,
        listId: firstList.id,
        cardId,
        currentBoardData: currentValueSelectBoard,
      }));
    }
  };

  /* List */
  handlerOnChangeSelectList = (e: any): void => {
    const listId = +e.target.value;
    const {
      startingValues: { cardId: movableCardId },
    } = this.props;
    const { currentBoardData } = this.state;

    const list = currentBoardData.lists[listId];
    const cards = Object.entries(list.cards).sort(([, a], [, b]) => a.position - b.position);

    // Is there a movable card on this board? ...
    const movableCard = cards.find(([, c]) => c.id === movableCardId)?.[1];
    // ... if there is, save its Id, if not, save -1
    const cardId = movableCard?.id || -1;

    this.setState((state) => ({ ...state, listId, cardId }));
  };

  /* Card */
  handlerOnChangeSelectCard = (e: any): void => {
    const selectCardId = +e.target.value;
    this.setState((state) => ({ ...state, cardId: selectCardId }));
  };

  /* MOVE CARD */
  handlerMoveCard = async (): Promise<void> => {
    const { startingValues } = this.props;
    const { boardId, listId, cardId, currentBoardData } = this.state;

    const positionCard = cardId >= 0 ? currentBoardData.lists[listId].cards[cardId].position : undefined;
    const position = positionCard || Object.keys(currentBoardData.lists[listId].cards).length + 1;

    const d = {
      card: startingValues.cardId,
      srcBoard: startingValues.boardId,
      srcList: startingValues.listId,
      srcData: startingValues.boardData,
      destBoard: boardId,
      destList: listId,
      destData: currentBoardData,
      position,
    };

    // Move in one list
    if (d.srcList === d.destList) {
      const newCardPosition = moveCardOneList({ ...d });
      const { moveCards, update } = this.props;
      await moveCards(d.srcBoard, newCardPosition);
      await update(d.srcBoard);

      // TODO - сделать перемещение карточки в одной доске и разных списках
      // Move between different lists in one board
    } else if (d.srcBoard === d.destBoard) {
      const newCardPosition = moveCardBetweenLists({ ...d });

      // Move between different lists and between different board
    } else {
      console.log('different lists, different board');
      const { delCrd, moveCards, createCrd, editCrd, closeCardDialog, update } = this.props;
      const card = { ...d.srcData.lists[d.srcList].cards[d.card] };
      const newCardPosition = moveCardBetweenDesks({ ...d });
      await delCrd(d.srcBoard, d.card);
      await moveCards(d.destBoard, newCardPosition);
      await createCrd(d.destBoard, card.title, d.destList, d.position);
      await editCrd(d.destBoard, d.destList, d.card, card.description);
      await update(d.srcBoard);
      closeCardDialog();
    }
  };

  render(): JSX.Element | null {
    const { startingValues } = this.props;
    const { boardId, listId, cardId, boardsList, currentBoardData } = this.state;

    if (!boardsList || !currentBoardData) return null;

    return (
      <div className={cn(styles.popupCardDialog)}>
        {/* HEADER */}
        <HeaderPopupCardDialog title="Перемещение карточки" classname="moveCardInTitleCardBox" />

        {/* BOARDS */}
        <Selection
          onChange={this.handlerOnChangeSelectBoard}
          data={{
            startingValues,
            key: 'boards',
            valueId: boardId,
            value: boardsList,
          }}
        />
        {/* LISTS */}
        <Selection
          onChange={this.handlerOnChangeSelectList}
          data={{
            startingValues,
            key: 'lists',
            valueId: listId,
            value: currentBoardData,
          }}
        />
        {/* CARDS */}
        <Selection
          onChange={this.handlerOnChangeSelectCard}
          data={{
            startingValues,
            key: 'cards',
            valueId: cardId,
            value: currentBoardData.lists[listId],
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
  delCrd: deleteCard,
  createCrd: addCard,
  editCrd: editDescriptionCard,
  moveCards: movedCards,
  update: getBoard,
};

export default connect(null, mapDispatchToProps)(MoveCard);
