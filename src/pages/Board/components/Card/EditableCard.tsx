/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ButtonLink = ({ ...props }): JSX.Element => (
  <a href="#" className="editor-card__btn-item" data-id-card={props.cardId} onClick={props.handlerOnClick}>
    <div className="icon">
      <FontAwesomeIcon icon={props.awesomeIcon} />
    </div>
    <span className="editor-card__btn-item-text">{props.titleBtn}</span>
  </a>
);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const EditableCard = (props: any): JSX.Element => {
  // @ts-ignore
  const { x, y, title, cardId, deleteCard, closeEditor, closeBGEditor, saveTitle } = props;
  const [cardTitle, setCardTitle] = useState(title);

  const renamecardTitle = (): void => {
    saveTitle(cardTitle, cardId);
  };

  const onInputcardTitle = (e: any): void => {
    setCardTitle(e.target.value);
  };

  // @ts-ignore
  return (
    <div className="quick-card-editor">
      <div className="background_edit_card_abs" onClick={closeBGEditor}>
        <span className="editor-card__close-icon" onClick={closeEditor}>
          <FontAwesomeIcon icon="times" />
        </span>
      </div>
      <div className="editor-card" style={{ top: `${y}px`, left: `${x}px` }}>
        <div className="editor-card__title">
          <textarea
            className="editor-card__title-edit"
            dir="auto"
            defaultValue={cardTitle}
            onInput={onInputcardTitle}
          />
          <input className="editor-card__title-edit-button" type="submit" value="Сохранить" onClick={renamecardTitle} />
        </div>
        <div className="editor-card__buttons">
          <ButtonLink
            titleBtn="delete card"
            awesomeIcon={['fas', 'trash-alt']}
            cardId={cardId}
            handlerOnClick={deleteCard}
          />
        </div>
      </div>
    </div>
  );
};

export default EditableCard;
