/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unused-state */
import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { editDescriptionCard } from '../../../store/modules/board/actions';

interface TypeProps {
  boardId: number;
  listId: number;
  cardId: number;
  description: string;
  updateBoard: () => void;
}

interface TypeState {
  description: string;
}

class Description extends React.Component<TypeProps, TypeState> {
  constructor(props: TypeProps) {
    super(props);
    const { description } = this.props;
    this.state = {
      description,
    };
  }

  componentWillUnmount(): void {
    this.editCard();
  }

  handlerChangeTextarea = (event: any): void => {
    event.preventDefault();
    const { target } = event;
    const { value } = target;
    this.setState({ description: value });
  };

  handlerOnBlurTextarea = (): void => {
    this.editCard();
  };

  editCard = (): void => {
    const { boardId, listId, cardId, updateBoard } = this.props;
    const { description } = this.state;
    editDescriptionCard(boardId, listId, cardId, description);
    updateBoard();
  };

  render(): JSX.Element {
    const { description } = this.state;
    return (
      <TextareaAutosize
        className="description-card-mod"
        style={{ width: 496 }}
        value={description}
        onBlur={this.handlerOnBlurTextarea}
        onInput={this.handlerChangeTextarea}
      />
    );
  }
}

export default Description;
