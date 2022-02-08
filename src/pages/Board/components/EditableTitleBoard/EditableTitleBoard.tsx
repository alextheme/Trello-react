/* eslint-disable no-console */
import React, { useContext, useState } from 'react';
import { connect } from 'react-redux';
import { checkInputText } from '../../../../common/scripts/commonFunctions';
import { renameTitleBoard } from '../../../../store/modules/board/action-creators';
import { BoardContext } from '../../boardContext';
import PopUpMessage from '../PopUpMessage/PopUpMessage';

interface TypeProps {
  title: string;
  changeBoardTitle: (boardId: number, title: string) => Promise<boolean>;
}

const EditableTitleBoard = ({ ...props }: TypeProps): JSX.Element => {
  const [openInputEditTitle, setOpenInputEditTitle] = useState(false);
  const [title, setTitle] = useState(props.title);
  const [prevTitle, setPrevTitle] = useState(props.title);
  const [errorMessage, setErrorMessage] = useState({ statusErrorText: false, res: '', errSymbols: '' });
  const { boardId } = useContext(BoardContext);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTitleOnClick = (event: any): void => {
    event.preventDefault();
    const { currentTarget } = event;
    const { clientWidth, innerText } = currentTarget;

    currentTarget.nextSibling.style.width = `${clientWidth}px`;

    setTimeout(() => {
      currentTarget.nextSibling.focus();
      currentTarget.nextSibling.select();
    }, 0);

    setErrorMessage({ statusErrorText: false, res: '', errSymbols: '' });
    setTitle(innerText);
    setOpenInputEditTitle(true);
  };

  /** Print new name board */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inputOnInputEditTitleHandler = (e: any): void => {
    e.preventDefault();
    const { target } = e;
    const { style, innerText, value } = target;
    style.width = `${value.length * 12 + 20}px`;
    setTitle(innerText);
  };

  /** Rename Board, ajax request */
  const renameBoard = async (nameTitle: string): Promise<void> => {
    const { status, res, errSymbols } = checkInputText(nameTitle);

    if (status && res === '' && boardId) {
      const { changeBoardTitle } = props;

      const response = await changeBoardTitle(boardId, nameTitle);

      if (response) {
        setTitle(nameTitle);
        setPrevTitle(nameTitle);
        setOpenInputEditTitle(false);
        setErrorMessage({ statusErrorText: true, res: '', errSymbols: '' });
        return;
      }
    }

    setTitle(prevTitle);
    setOpenInputEditTitle(false);
    setErrorMessage({ statusErrorText: true, res, errSymbols });
  };

  /** Focus out */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inputOnBlurHandler = (e: any): void => {
    e.preventDefault();
    const {
      target: { value: nameTitle },
    } = e as { target: { value: string } };
    renameBoard(nameTitle);
  };

  /** Press Enter on input */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inputOnKeyPressHandler = (e: any): void => {
    const { code, target } = e;
    if (code === 'Enter') renameBoard(target.value);
  };

  //
  return (
    <div className="editable-title" style={{ position: 'relative' }}>
      <h2 className="title" onClick={handleTitleOnClick} style={{ display: openInputEditTitle ? 'none' : 'block' }}>
        {title}
      </h2>
      <input
        id="input-edit-board-title"
        className="input-edit-board-title"
        type="text"
        onInput={inputOnInputEditTitleHandler}
        onBlur={inputOnBlurHandler}
        onKeyPress={inputOnKeyPressHandler}
        defaultValue={title}
        style={{ display: openInputEditTitle ? 'block' : 'none' }}
        autoComplete="off"
      />
      {errorMessage.statusErrorText && errorMessage.res !== '' && (
        <PopUpMessage {...errorMessage} parentId="input-edit-board-title" />
      )}
    </div>
  );
};

export default connect(null, { changeBoardTitle: renameTitleBoard })(EditableTitleBoard);
