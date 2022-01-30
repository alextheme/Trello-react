import React, { useContext, useState } from 'react';
import { connect } from 'react-redux';
import { renameTitleList } from '../../../../store/modules/board/action-creators';
import { checkInputText } from '../../../../common/scripts/commonFunctions';
import PopUpMessage from '../PopUpMessage/PopUpMessage';
import { BoardContext } from '../../boardContext';

type TypeProps = {
  titleList: string;
  listId: number;
  processMovingList: boolean;
  listRenameTitle: (boardId: number, listId: number, title: string) => Promise<boolean>;
};

const EditableTitleList = ({ titleList, listId, processMovingList, listRenameTitle }: TypeProps): JSX.Element => {
  const [title, setTitle] = useState(titleList);
  const [prevTitle, setPrevTitle] = useState(titleList);
  const [openInput, setOpenInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ statusErrorText: false, res: '', errSymbols: '' });
  const [heightTitle, setHeightTitle] = useState(0);
  const { updateBoard, boardId } = useContext(BoardContext);

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
    if (!processMovingList) {
      const { currentTarget } = event;
      const { height } = currentTarget.getBoundingClientRect();
      setHeightTitle(height);

      setOpenInput(true);
      setErrorMessage({ statusErrorText: true, res: '', errSymbols: '' });

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

    if (status && boardId && updateBoard) {
      const { value: editTitle } = textarea as { value?: string };
      const response = await listRenameTitle(boardId, listId, editTitle || title);
      if (response) {
        setTitle(editTitle || title);
        setPrevTitle(editTitle || title);
        textarea.classList.remove('focus');
        setOpenInput(false);
      } else {
        setTitle(prevTitle);
        setOpenInput(false);
      }
    } else {
      setErrorMessage({ statusErrorText: true, res, errSymbols });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      textarea.focus(); // @ts-ignore
      textarea.select();
    }
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
        {title}
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
      {openInput && errorMessage.res !== '' && (
        <PopUpMessage {...errorMessage} parentId={`input-title-list-${listId}`} />
      )}
    </div>
  );
};

const mapDispatchToProps = { listRenameTitle: renameTitleList };

export default connect(null, mapDispatchToProps)(EditableTitleList);
