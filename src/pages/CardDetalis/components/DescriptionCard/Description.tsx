/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unused-state */
import React from 'react';
import { connect } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import { editDescriptionCard } from '../../../../store/modules/board/action-creators';
import { BoardContext, IBoardContext } from '../../../Board/boardContext';
import './Description.scss';

interface TypeProps {
  listId: number;
  cardId: number;
  description: string;
  cardEditDescription: (board_id: number, list_id: number, card_id: number, description: string) => void;
}

interface TypeState {
  mount: boolean;
  description: string;
}

class Description extends React.Component<TypeProps, TypeState> {
  constructor(props: TypeProps) {
    super(props);
    const { description } = this.props;
    this.state = {
      mount: true,
      description,
    };
  }

  componentDidMount(): void {
    this.setState({ mount: true });
  }

  componentWillUnmount(): void {
    this.setState({ mount: false });
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

  editCard = async (): Promise<void> => {
    const { listId, cardId, cardEditDescription } = this.props;
    const { description, mount } = this.state;
    const { updateBoard, boardId } = this.context as IBoardContext;
    await cardEditDescription(boardId, listId, cardId, description);
    if (mount) updateBoard();
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

const mapDispatchToProps = {
  cardEditDescription: editDescriptionCard,
};

Description.contextType = BoardContext;

export default connect(null, mapDispatchToProps)(Description);
