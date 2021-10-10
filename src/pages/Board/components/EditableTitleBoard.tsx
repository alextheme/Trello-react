/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { checkInputText, getHtmlElementByID } from '../../../common/scripts/commonFunctions';
import { renameTitleBoard } from '../../../store/modules/board/actions';
import PopUpMessage from './PopUpMessage/PopUpMessage';

interface TypeProps {
  title: string;
  boardId: string;
}

const EditableTitleBoard = ({ ...props }: TypeProps): JSX.Element => {
  const [openInputEditTitle, setOpenInputEditTitle] = useState(false);
  const [title, setTitle] = useState(props.title);
  const [errorMessage, setErrorMessage] = useState({ statusErrorText: false, res: '', errSymbols: '' });
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
    return (): void => setMount(false);
  });

  const handleTitleOnClick = (event: any): void => {
    event.preventDefault();
    const { target, currentTarget } = event;
    const { clientWidth, innerText } = target;

    currentTarget.nextSibling.style.width = `${clientWidth}px`;

    setTimeout(() => {
      currentTarget.nextSibling.focus();
      currentTarget.nextSibling.select();
    }, 0);

    setTitle(innerText);
    setOpenInputEditTitle(true);
  };

  /** Print new name board */
  const onInputEditTitleHandler = (e: any): void => {
    e.preventDefault();
    const { target } = e;
    const { style, innerText, value } = target;

    if (errorMessage.statusErrorText) {
      setErrorMessage({ statusErrorText: false, res: '', errSymbols: '' });
    }
    style.width = `${value.length * 12 + 20}px`;
    setTitle(innerText);
  };

  /** Rename Board, ajax request */
  const renameBoard = async (nameTitle: string): Promise<boolean> => {
    if (mount) {
      const { status, res, errSymbols } = checkInputText(nameTitle);

      if (status) {
        await renameTitleBoard(+props.boardId, nameTitle);
        setTitle(nameTitle);
        setOpenInputEditTitle(false);
        return true;
      }

      setErrorMessage({ statusErrorText: true, res, errSymbols });

      return false;
    }
    return false;
  };

  /** Focus out */
  const onBlurInputHandler = async (e: any): Promise<void> => {
    e.preventDefault();
    const { target } = e;
    const { value } = target;
    const res = await renameBoard(value);
    if (!res) {
      const input = getHtmlElementByID('board__input-edit-title');
      input?.focus(); // @ts-ignore
      input?.select();
    }
  };

  /** Press Enter on input */
  const onKeyPressInputHandler = async (e: any): Promise<void> => {
    const { charCode, code, target } = e;
    if (charCode === 13 && code === 'Enter') {
      const res = await renameBoard(target.value);

      if (!res) {
        const input = getHtmlElementByID('board__input-edit-title');
        input?.focus(); // @ts-ignore
        input?.select();
      }
    }
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
        onInput={onInputEditTitleHandler}
        onBlur={onBlurInputHandler}
        onKeyPress={onKeyPressInputHandler}
        defaultValue={title}
        style={{ display: openInputEditTitle ? 'block' : 'none' }}
        autoComplete="off"
      />
      {errorMessage.statusErrorText ? <PopUpMessage {...errorMessage} parentId="input-edit-board-title" /> : null}
    </div>
  );
};

export default EditableTitleBoard;
