import React, { Component } from 'react';
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
        <p className="label-warning">
          Все действия будут удалены из ленты, и вы не сможете повторно открыть карточку. Отмена невозможна.
        </p>
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
