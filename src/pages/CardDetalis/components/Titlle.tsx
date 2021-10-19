/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { renameTitleCard } from '../../../store/modules/board/actions';

interface TypeProps {
  boardId: number;
  listId: number;
  cardId: number;
  title: string;
  updateBoard: () => void;
}

interface TypeState {
  title: string;
}

class Title extends React.Component<TypeProps, TypeState> {
  constructor(props: TypeProps) {
    super(props);
    const { title } = this.props;
    this.state = {
      title,
    };
  }

  componentDidMount(): void {
    // this.setSize();
  }

  componentWillUnmount(): void {
    this.renameTitle();
  }

  handlerChangeTextarea = (event: any): void => {
    event.preventDefault();
    const { target } = event;
    const { value } = target;
    this.setState({ title: value });
  };

  handlerOnBlurTextarea = (): void => {
    this.renameTitle();
  };

  renameTitle = (): void => {
    const { boardId, listId, cardId, updateBoard } = this.props;
    const { title } = this.state;
    renameTitleCard(boardId, cardId, { title, list_id: listId });
    updateBoard();
  };

  render(): JSX.Element {
    const { title } = this.state;
    return (
      <TextareaAutosize
        className="title-mod"
        style={{ width: 672 }}
        value={title}
        onBlur={this.handlerOnBlurTextarea}
        onInput={this.handlerChangeTextarea}
      />
    );
  }
}

export default Title;
