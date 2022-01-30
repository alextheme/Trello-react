import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import './board.scss';
import { getBoards, deleteBoard } from '../../../../store/modules/boards/action-creators';

type PropsType = {
  boardId: number;
  title: string;
  getBoards: () => Promise<void>;
  deleteBoard: (boardId: number) => Promise<void>;
};

const Board = (props: PropsType): JSX.Element => {
  const { boardId, title, deleteBoard: delBoard } = props;
  const isMountedRef: React.MutableRefObject<boolean | null> = useRef(null);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  useEffect(() => {
    isMountedRef.current = true;
    return (): boolean => (isMountedRef.current = false);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDeleteBoard = async (e: any): Promise<void> => {
    e.preventDefault();
    const boardIdFromHtml = e.target.getAttribute('data-id');
    await delBoard(boardIdFromHtml);
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

export default connect(null, { getBoards, deleteBoard })(Board);
