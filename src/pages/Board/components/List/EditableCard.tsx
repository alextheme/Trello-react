/* eslint-disable react/no-this-in-sfc */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PopUpMessage from '../PopUpMessage/PopUpMessage';
import { checkInputText } from '../../../../common/scripts/commonFunctions';

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { x, y, card, deleteCard, closeEditor, closeBGEditor, saveTitle, width, openEditCard } = props;
  const [cardTitle, setCardTitle] = useState(card.title);
  const [statusErrorText, setStatusErrorText] = useState({ statusErrorText: false, res: '', errSymbols: '' });
  const textArea: React.LegacyRef<HTMLTextAreaElement> | undefined = useRef(null);

  useEffect(() => {
    // this.textArea?.focus(); // class component
    textArea?.current?.focus(); // function component
  }, []);

  const handleFocus = (e: { target: any }): void => {
    const { target } = e;

    setTimeout(() => {
      target.selectionStart = 0;
      target.selectionEnd = 9000;
    }, 0);
  };

  const renameCardTitle = async (): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { status, res, errSymbols } = checkInputText(cardTitle);

    if (status) {
      await saveTitle(cardTitle, card.id);
    } else {
      setStatusErrorText({ statusErrorText: true, res, errSymbols });
      setTimeout(() => {
        setStatusErrorText({ statusErrorText: false, res, errSymbols });
      }, 2000);
    }
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
        <textarea
          id={`card-edit-text-area-${card.id}`}
          className="editor-card__title-edit"
          style={{ width }}
          dir="auto"
          defaultValue={cardTitle}
          onInput={onInputcardTitle}
          // ref={(node) => (this.textArea = node)} // class component
          ref={textArea} // function component
          onFocus={handleFocus}
        />
        <input className="editor-card__title-edit-button" type="submit" value="Сохранить" onClick={renameCardTitle} />

        <div className="editor-card__buttons">
          <ButtonLink
            titleBtn="delete card"
            awesomeIcon={['fas', 'trash-alt']}
            cardId={card.id}
            handlerOnClick={deleteCard}
          />
        </div>

        <PopUpMessage {...statusErrorText} parentId={`card-edit-text-area-${card.id}`} />
      </div>
    </div>
  );
};

export default EditableCard;
