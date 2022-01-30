/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './CopyCard.scss';
import { IFuncType, PopupCardDialogProps, PopupCardDialogState } from './CopyCard.props';
import { IBoardContent, IBoards, IListContent } from '../../../../common/interfaces/Interfaces';
import instance from '../../../../api/request';
import { Selection } from '../Selection/Selection';
import HeaderPopupCardDialog from '../HeaderPopupCardDialog/HeaderPopupCardDialog';
import { Button } from '../Button/Button';
import { createNewCardWithMovement, editCard } from '../../../../store/modules/board/action-creators';
import { BoardContext } from '../../../Board/boardContext';
import { assignOrRemoveUsersToOrFromCard } from '../../../../store/modules/user/assignOrRemoveUsersToFromCard';

class CopyCard extends Component<PopupCardDialogProps & IFuncType, PopupCardDialogState> {
  constructor(props: PopupCardDialogProps & IFuncType) {
    super(props);

    const { src } = this.props;

    this.state = {
      boardId: src.boardId,
      listId: src.listId,
      positionCard: src.positionCard,
      boardsList: null,
      boardData: src.boardData,
      titleCard: src.boardData.lists[src.listId].cards[src.cardId].title,
      copyDescription: true,
      copyMembers: true,
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

  /* COPY CARD */
  handlerCopyCard = (): void => {
    this.copyCard();
  };

  // Copy
  copyCard = async (): Promise<void> => {
    const { src, createCrd, editCrd, copyMembersInCard, closePopup } = this.props;
    const { boardId, listId, boardData, positionCard, titleCard, copyDescription, copyMembers } = this.state;
    const { updateBoard } = this.context;

    // 1. Create card
    const resultCreateCard = await createCrd(boardId, boardData.lists[listId], positionCard, titleCard);
    if (resultCreateCard) {
      let resultCopyCard = true;
      const card = src.boardData.lists[src.listId].cards[src.cardId];
      updateBoard();
      closePopup();

      // 2. Copy description
      if (copyDescription) {
        resultCopyCard = await editCrd(boardId, listId, resultCreateCard, card.description, 'description');
      }
      // 3. Copy members
      if (copyMembers) {
        resultCopyCard = await copyMembersInCard(boardId, resultCreateCard, updateBoard, card.users, []);
      }
      // 4. Update
      if (resultCopyCard) {
        updateBoard();
        closePopup();
      }
    }
  };

  render(): JSX.Element | null {
    const { src } = this.props;
    const { boardId, listId, positionCard, boardsList, boardData, titleCard, copyDescription, copyMembers } =
      this.state;

    if (!boardsList || !boardData) return null;

    return (
      <div className="popup-card-dialog">
        {/* HEADER */}
        <HeaderPopupCardDialog title="Перемещение карточки" classname="moveCardInTitleCardBox" />

        <h5 className="label-selections-box">Название</h5>

        <textarea
          className="copy-name-card-textarea"
          onChange={(event): void => {
            this.setState({ titleCard: event.target.value });
          }}
          defaultValue={titleCard}
        />

        <h5 className="label-selections-box">Также копировать...</h5>

        <div className="check-div">
          <input
            type="checkbox"
            id="idKeepDescription"
            checked={copyDescription}
            onChange={(): void => {
              this.setState({ copyDescription: !copyDescription });
            }}
          />
          <label htmlFor="idKeepDescription">Описание</label>
        </div>

        <div className="check-div">
          <input
            type="checkbox"
            id="idKeepMembers"
            checked={copyMembers}
            onChange={(): void => {
              this.setState({ copyMembers: !copyMembers });
            }}
          />
          <label htmlFor="idKeepMembers">Участники</label>
        </div>

        <h5 className="label-selections-box">Копировать в...</h5>

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
        <Button appearance="blue" onClick={this.handlerCopyCard} className="button-move-card">
          Copy
        </Button>
      </div>
    );
  }
}

const mapDispatchToProps = {
  createCrd: createNewCardWithMovement, // addCard,
  editCrd: editCard,
  copyMembersInCard: assignOrRemoveUsersToOrFromCard,
};

CopyCard.contextType = BoardContext;

export default connect(null, mapDispatchToProps)(CopyCard);
