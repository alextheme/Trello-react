/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { getHtmlElementByID } from '../../../../common/scripts/commonFunctions';

interface TypeProps {
  title: string;
  listId: string;
  boardId: string;
  renameBoard: any;
  updateBoard: any;
  titleClassName: string;
  inputClassName: string;
  inputId: string;
}

const EditableTitleBoard = ({ ...props }: TypeProps): JSX.Element => {
  const [openInputEditTitle, setOpenInputEditTitle] = useState(false);
  const [title, setTitle] = useState(props.title);

  const handleTitleOnClick = (e: any): void => {
    e.preventDefault();
    const input = getHtmlElementByID(props.inputId);
    if (input) {
      input.style.width = `${e.target.clientWidth}px`;

      setTimeout(() => {
        input.focus(); // @ts-ignore
        input.select();
      }, 0);
    }
    setTitle(e.target.innerText);
    setOpenInputEditTitle(true);
  };

  /**
   * Print new name board
   */
  const onInputEditTitleHandler = (e: any): void => {
    e.preventDefault();
    e.target.style.width = `${e.target.value.length * 12}px`;
    setTitle(e.target.innerText);
  };

  const handleRenameBoard = async (nameTitle: string): Promise<void> => {
    await props.renameBoard(+props.boardId, nameTitle);
    await props.updateBoard();
    setTitle(nameTitle);
    setOpenInputEditTitle(false);
  };

  /**
   * Focus out
   */
  const onBlurInputHandler = async (e: any): Promise<void> => {
    e.preventDefault();
    await handleRenameBoard(e.target.value);
  };

  //
  return (
    <div className="editable-title">
      <h2
        className={props.titleClassName}
        onClick={handleTitleOnClick}
        style={{ display: openInputEditTitle ? 'none' : 'block' }}
      >
        {title}
      </h2>
      <input
        className={props.inputClassName ? props.inputClassName : props.inputId}
        id={`${props.inputId}`}
        type="text"
        onInput={onInputEditTitleHandler}
        onBlur={onBlurInputHandler}
        defaultValue={title}
        style={{ display: openInputEditTitle ? 'block' : 'none' }}
        autoComplete="off"
      />
    </div>
  );
};

export default EditableTitleBoard;
