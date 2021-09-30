/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable jsx-a11y/no-autofocus */
import React, { useState } from 'react';
import { renameTitleList } from '../../../../store/modules/board/actions';
import { setFocusToElement } from '../../../../common/scripts/commonFunctions';

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const EditableTitleList = ({ boardId, titleList, listId, updateBoard }): JSX.Element => {
  const [title, setTitle] = useState(titleList);
  const [openInput, setOpenInput] = useState(false);

  const handlerOnInputEditTitle = (e: any): void => {
    setTitle(e.target.value);
  };

  const handlerOnMouseUpListTitle = (): void => {
    setOpenInput(true);
    setFocusToElement(`editable-list-title-${listId}`);
  };

  const handlerOnBlurEditTitle = (): void => {
    renameTitleList(boardId, listId, title);
    updateBoard();
    setOpenInput(false);
  };

  const autoFocus = true;
  const titleListRender = openInput ? (
    <input
      id={`editable-list-title-${listId}`}
      type="text"
      defaultValue={title}
      onInput={handlerOnInputEditTitle}
      onBlur={handlerOnBlurEditTitle}
      autoFocus={autoFocus}
      autoComplete="off"
    />
  ) : (
    <h2 className="list-title" onMouseUp={handlerOnMouseUpListTitle}>
      {titleList}
    </h2>
  );

  //
  return <div className="editable-list-title no-moved">{titleListRender}</div>;
};

export default EditableTitleList;
