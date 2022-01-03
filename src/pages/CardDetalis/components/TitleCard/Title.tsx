/* eslint-disable react/no-unused-state */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { connect } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import { renameTitleCard } from '../../../../store/modules/board/action-creators';
import { BoardContext } from '../../../Board/boardContext';
import './Title.scss';

interface TypeProps {
  boardId: number;
  listId: number;
  cardId: number;
  title: string;
  cardRenameTitle: (board_id: number, card_id: number, data: { title: string; list_id: number }) => Promise<boolean>;
}

interface TypeState {
  prevValueTitle: string;
  title: string;
}

class Title extends React.Component<TypeProps, TypeState> {
  mount = false;

  constructor(props: TypeProps) {
    super(props);
    const { title } = this.props;
    this.state = {
      prevValueTitle: title,
      title,
    };
  }

  componentDidMount(): void {
    this.mount = true;
  }

  componentWillUnmount(): void {
    this.mount = false;
    this.renameTitle();
  }

  handlerChangeTextarea = (event: any): void => {
    event.preventDefault();
    const { target } = event;
    const { value } = target;
    this.setState({ title: value });
  };

  handlerOnBlurTextarea = (): void => {
    if (!this.mount) return;
    this.renameTitle();
  };

  renameTitle = async (): Promise<void> => {
    if (!this.mount) return;

    const { boardId, listId, cardId, cardRenameTitle } = this.props;
    const { prevValueTitle, title } = this.state;

    const response = await cardRenameTitle(boardId, cardId, { title, list_id: listId });
   
    if (response) {      
      this.setState({ prevValueTitle: title });
    } else {
      this.setState({ title: prevValueTitle });
    }

    const { updateBoard } = this.context;
    await updateBoard();
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

const mapDispatchToProps = { cardRenameTitle: renameTitleCard };

Title.contextType = BoardContext;

export default connect(null, mapDispatchToProps)(Title);
