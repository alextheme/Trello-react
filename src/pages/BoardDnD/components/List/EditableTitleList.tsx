import React, { useState } from 'react';
import { renameTitleList } from '../../../../store/modules/board/actions';
import { checkInputText } from '../../../../common/scripts/commonFunctions';
import PopUpMessage from '../PopUpMessage/PopUpMessage';

type TypeProps = {
  boardId: string;
  titleList: string;
  listId: number;
  updateBoard: () => void;
  movingProcess: boolean;
};

const EditableTitleList = ({ boardId, titleList, listId, updateBoard, movingProcess }: TypeProps): JSX.Element => {
  const [title, setTitle] = useState(titleList);
  const [openInput, setOpenInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ statusErrorText: false, res: '', errSymbols: '' });
  const [heightTitle, setHeightTitle] = useState(0);

  /** Input text in textarea */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlerInputTextarea = (event: any): void => {
    if (errorMessage.statusErrorText) {
      setErrorMessage({ statusErrorText: false, res: '', errSymbols: '' });
    }
    const { value } = event.target;
    setTitle(value);
  };

  /** Open Editor List Title */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlerPressTitle = (event: any): void => {
    if (!movingProcess) {
      const { currentTarget } = event;
      const { height } = currentTarget.getBoundingClientRect();
      setHeightTitle(height);

      setOpenInput(true);

      setTimeout(() => {
        currentTarget.nextSibling.focus();
        currentTarget.nextSibling.select();
        currentTarget.nextSibling.classList.add('focus');
      }, 10);
    }
  };

  /** Asyng request on Rename Title */
  const renameTitle = async (textarea: HTMLElement): Promise<void> => {
    const { status, res, errSymbols } = checkInputText(title);

    if (status) {
      setTitle(title);
      await renameTitleList(boardId, listId, title);
      await updateBoard();
      setOpenInput(false);
      textarea.classList.remove('focus');
      return;
    }

    setErrorMessage({ statusErrorText: true, res, errSymbols });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    textarea.focus(); // @ts-ignore
    textarea.select();
  };

  /** Reneme Titne on blur Textarea */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onBlurEditTitleHandeler = (event: any): void => {
    renameTitle(event.currentTarget);
  };

  /** Key Press */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onKeyPressEditTitleHandler = (event: any): void => {
    if (event.code === 'Enter') {
      renameTitle(event.currentTarget);
    }
  };

  //
  return (
    <div className="editable-list-title">
      <h2
        className="list-title"
        style={{ display: openInput ? 'none' : 'block', position: 'relative' }}
        onClick={handlerPressTitle}
      >
        {titleList}
      </h2>
      <textarea
        id={`input-title-list-${listId}`}
        className="editable-list-textarea"
        defaultValue={title}
        onInput={handlerInputTextarea}
        onBlur={onBlurEditTitleHandeler}
        onKeyPress={onKeyPressEditTitleHandler}
        autoComplete="off"
        style={{ display: openInput ? 'block' : 'none', position: 'relative', height: heightTitle }}
      />
      {openInput ? <PopUpMessage {...errorMessage} parentId={`input-title-list-${listId}`} /> : null}
    </div>
  );
};

export default EditableTitleList;
