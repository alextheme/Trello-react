import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { getHtmlElementByID, setFocusToElement } from '../../../../common/scripts/commonFunctions';
import { getBoard, renameTitleBoard } from '../../../../store/modules/board/actions';

interface TypeProps {
  title: string;
  listId: string;
  boardId: string;
  updateBoard: any;
  getBoard: any;
  titleClassName: string;
  inputClassName: string;
  inputId: string;
}

const EditableTitle = ({ ...p }: TypeProps): JSX.Element => {
  const [openInputEditTitle, setOpenInputEditTitle] = useState(false);
  const [title, setTitle] = useState(p.title);
  const isMountedRef: React.MutableRefObject<boolean | null> = useRef(null);

  // @ts-ignore
  useEffect(() => {
    isMountedRef.current = true;
    return (): boolean => (isMountedRef.current = false);
  });

  const handleTitleOnClick = (e: any): void => {
    e.preventDefault();
    const htmlElementInput = getHtmlElementByID(p.inputId);
    if (htmlElementInput) {
      htmlElementInput.style.width = `${e.target.clientWidth}px`;
    }
    setFocusToElement(p.inputId);
    setTitle(e.target.innerText);
    setOpenInputEditTitle(true);
  };

  /**
   * Print new name board
   */
  const onInputEditTitleHandler = (e: any): void => {
    e.preventDefault();
    const inputElem = getHtmlElementByID(p.inputId);
    if (inputElem) inputElem.style.width = `${e.target.value.length * 12}px`;
    setTitle(e.target.innerText);
  };

  const handleRenameBoard = async (nameTitle: string): Promise<void> => {
    await renameTitleBoard(p.boardId, nameTitle);
    await p.getBoard(p.boardId);
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

  return (
    <div className="editable-title">
      <h2
        className={p.titleClassName}
        onClick={handleTitleOnClick}
        style={{ display: openInputEditTitle ? 'none' : 'block' }}
      >
        {title}
      </h2>
      <input
        className={p.inputClassName ? p.inputClassName : p.inputId}
        id={`${p.inputId}`}
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

export default connect(null, { getBoard })(EditableTitle);
