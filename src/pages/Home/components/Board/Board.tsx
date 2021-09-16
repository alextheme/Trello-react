import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import './board.scss';
import { getBoards } from '../../../../store/modules/boards/actions';
import { deleteBoard } from '../../../../store/modules/board/actions';

type PropsType = {
  boardId: number;
  title: string;
  getBoards: () => Promise<void>;
};

const Board = (props: PropsType): JSX.Element => {
  const { boardId, title } = props;
  const isMountedRef: React.MutableRefObject<boolean | null> = useRef(null);

  useEffect(() => {
    isMountedRef.current = true;
    return (): any => (isMountedRef.current = false);
  });

  const handleDeleteBoard = async (e: any): Promise<void> => {
    e.preventDefault();
    const boardIdFromHtml = e.target.getAttribute('data-id');
    await deleteBoard(boardIdFromHtml);
    if (isMountedRef.current) {
      props.getBoards();
    }
  };

  return (
    <div className="board__container">
      <div className="board__delete_btn" data-id={boardId} onClick={handleDeleteBoard} />
      <div className="board__title-box">
        <span className="board__title">{title}</span>
      </div>
    </div>
  );
};

export default connect(null, { getBoards })(Board);
