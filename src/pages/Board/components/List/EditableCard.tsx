import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PopUpMessage from '../PopUpMessage/PopUpMessage';
import { checkInputText } from '../../../../common/scripts/commonFunctions';
import { IButtonLinkForEditableCard, IEditableCardProps } from '../../../../common/interfaces/Interfaces';

const ButtonLink = (props: IButtonLinkForEditableCard): JSX.Element => {
  const { cardId, awesomeIcon, titleBtn, handlerOnClick } = props;
  return (
    <a href="#" className="editor-card__btn-item" data-id-card={cardId} onClick={handlerOnClick}>
      <div className="icon">
        <FontAwesomeIcon icon={awesomeIcon} />
      </div>
      <span className="editor-card__btn-item-text">{titleBtn}</span>
    </a>
  );
};

const EditableCard = (props: IEditableCardProps): JSX.Element => {
  const { x, y, card, deleteCard, closeEditor, closeBGEditor, saveTitle, width } = props;
  const [cardTitle, setCardTitle] = useState(card.title);
  const [statusErrorText, setStatusErrorText] = useState({ statusErrorText: false, res: '', errSymbols: '' });
  const textArea: React.LegacyRef<HTMLTextAreaElement> | undefined = useRef(null);

  useEffect(() => {
    // this.textArea?.focus(); // class component
    textArea?.current?.focus(); // function component
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFocus = (e: { target: any }): void => {
    const { target } = e;

    setTimeout(() => {
      target.selectionStart = 0;
      target.selectionEnd = 9000;
    }, 0);
  };

  const renameCardTitle = async (): Promise<void> => {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onInputcardTitle = (e: any): void => {
    setCardTitle(e.target.value);
  };

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
