/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable jsx-a11y/no-autofocus */
import React, { useState } from 'react';
import { renameTitleList } from '../../../../store/modules/board/actions';
import { checkInputText, getHtmlElementByID } from '../../../../common/scripts/commonFunctions';
import PopUpMessage from '../PopUpMessage/PopUpMessage';

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const EditableTitleList = ({ boardId, titleList, listId, updateBoard }): JSX.Element => {
  const [title, setTitle] = useState(titleList);
  const [openInput, setOpenInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ status: false, res: '', errSymbols: '' });

  const onInputEditTitleHandler = (e: any): void => {
    if (errorMessage.status) {
      setErrorMessage({ status: false, res: '', errSymbols: '' });
    }
    setTitle(e.target.value);
  };

  const getInput = (): HTMLElement | null => getHtmlElementByID(`input-title-list-${listId}`);

  const onMouseUpTitleHandler = (e: any): void => {
    e.preventDefault();
    setOpenInput(true);
    setTimeout(() => {
      const element = getInput();
      element?.focus(); // @ts-ignore
      element?.select();
    }, 10);
  };

  const renameTitle = async (): Promise<void> => {
    const { status, res, errSymbols } = checkInputText(title);

    if (status) {
      setTitle(title);
      await renameTitleList(boardId, listId, title);
      await updateBoard();
      setOpenInput(false);
      return;
    }

    setErrorMessage({ status: true, res, errSymbols });

    const input = getInput();
    input?.focus(); // @ts-ignore
    input?.select();
  };

  const onBlurEditTitleHandeler = (): void => {
    renameTitle();
  };

  const onKeyPressEditTitleHandler = (e: any): void => {
    if (e.charCode === 13 && e.code === 'Enter') {
      renameTitle();
    }
  };

  //
  return (
    <div id={`editable-list-title-${listId}`} className="editable-list-title">
      <h2
        className="list-title"
        style={{ display: openInput ? 'none' : 'block', position: 'relative' }}
        onMouseUp={onMouseUpTitleHandler}
      >
        {titleList}
      </h2>
      <input
        id={`input-title-list-${listId}`}
        type="text"
        defaultValue={title}
        onInput={onInputEditTitleHandler}
        onBlur={onBlurEditTitleHandeler}
        onKeyPress={onKeyPressEditTitleHandler}
        autoComplete="off"
        style={{ display: openInput ? 'block' : 'none', position: 'relative' }}
      />
      {openInput ? <PopUpMessage {...errorMessage} parentId={`input-title-list-${listId}`} /> : null}
    </div>
  );
};

export default EditableTitleList;
