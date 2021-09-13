import React from 'react';
import { connect } from 'react-redux';
import './board.scss';
import instance from '../../../../api/request';
import { getBoards } from '../../../../store/modules/boards/actions';

type PropsType = {
  boardId: number;
  title: string;
  getBoards: () => Promise<void>;
};

const Board = (props: PropsType): JSX.Element => {
  const { boardId, title } = props;

  const handleDeleteBoard = async (e: any): Promise<void> => {
    e.preventDefault();
    const boardIdFromHtml = e.target.getAttribute('data-id');
    try {
      await instance.delete(`/board/${boardIdFromHtml}`);
      await props.getBoards();
      // eslint-disable-next-line @typescript-eslint/no-shadow
    } catch (e) {
      console.log(e);
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
