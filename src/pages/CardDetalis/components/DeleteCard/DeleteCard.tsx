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
// import cn from 'classnames';
import { connect } from 'react-redux';
import './DeleteCard.scss';
import { PopupCardDialogProps, PopupCardDialogState } from './DeleteCard.props';
import HeaderPopupCardDialog from '../HeaderPopupCardDialog/HeaderPopupCardDialog';
import { Button } from '../Button/Button';
import { deleteCard } from '../../../../store/modules/board/action-creators';
import { BoardContext } from '../../../Board/boardContext';

class DeleteCard extends Component<PopupCardDialogProps, PopupCardDialogState> {
  /* DELETE CARD */
  handlerDeleteCard = async (): Promise<void> => {
    const { src, closePopup, deleteCrd, closeCardDialog } = this.props;
    const { updateBoard } = this.context;

    const resultDeleteCard = await deleteCrd(src.boardId, src.cardId, src.boardData.lists[src.listId]);
    if (resultDeleteCard) {
      updateBoard();
      closePopup();
      closeCardDialog();
    }
  };

  render(): JSX.Element | null {
    return (
      <div className="popup-card-dialog">
        {/* HEADER */}
        <HeaderPopupCardDialog title="Удаление карточки" classname="deleteCardInTitleCardBox" />
        {/* WARNING */}
        <p className="label-warning">Все действия будут удалены из ленты, и вы не сможете повторно открыть карточку. Отмена невозможна.</p>
        {/* BUTTON */}
        <Button appearance="brown" onClick={this.handlerDeleteCard} className="button-delete-card">
          Delete card
        </Button>
      </div>
    );
  }
}

const mapDispatchToProps = {
  deleteCrd: deleteCard,
};

DeleteCard.contextType = BoardContext;

export default connect(null, mapDispatchToProps)(DeleteCard);
