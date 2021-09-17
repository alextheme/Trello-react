import React from 'react';
import './card.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { deleteCard, getBoard } from '../../../../store/modules/board/actions';

interface TypeProps {
  title: string;
  id: string;
  boardId: string;
  position: number;
  getBoard: any;
}

const Card = ({ title, id, boardId, position, ...p }: TypeProps): JSX.Element => {
  // const { openCardEtitor, setOpenCardEditor } = useState(false);

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  // const handleOpenCardEditor = () => {};

  const onClickHandlerDeleteCard = async (idBoard: any, idCard: any): Promise<void> => {
    await deleteCard(idBoard, idCard);
    await p.getBoard(idBoard);
  };

  return (
    <div className="card">
      <p className="card__title">{`${title} (${id}) поз: ${position}`}</p>
      <button
        className="card__open-card-editor-btn"
        data-board_id={boardId}
        data-card_id={id}
        // onClick={handleOpenCardEditor}
        onClick={onClickHandlerDeleteCard.bind(this, boardId, id)}
      >
        <FontAwesomeIcon icon="pencil-alt" />
      </button>

      <div className="quick-card-editor" style={{}}>
        {/*<span className="quick-card-editor__close-icon">*/}
        {/*  <FontAwesomeIcon icon="times" />*/}
        {/*</span>*/}
        <div className="quick-card__editor-card">
          <textarea className="quick-card-editor__edit-title" dir="auto" defaultValue="valueTextArea" />
          <input className="quick-card-editor__button" type="submit" value="Сохранить" />
        </div>
        <div className="quick-card-editor-buttons">
          <a href="#" className="quick-card-editor-buttons-item">
            <span className="quick-card-editor-buttons-item-icon">
              <FontAwesomeIcon icon="signature" />
            </span>
            <span className="quick-card-editor-buttons-item-text">rename card</span>
          </a>
          <a href="#" className="quick-card-editor-buttons-item">
            <span className="quick-card-editor-buttons-item-icon">
              <FontAwesomeIcon icon="trash-alt" />
            </span>
            <span className="quick-card-editor-buttons-item-text">delete card</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default connect(null, { getBoard })(Card);
