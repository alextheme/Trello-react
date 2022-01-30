import React from 'react';
import { connect } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import { editCard } from '../../../../store/modules/board/action-creators';
import { BoardContext, IBoardContext } from '../../../Board/boardContext';
import './Description.scss';

interface TypeProps {
  listId: number;
  cardId: number;
  description: string;
  cardEdit: (
    board_id: number,
    list_id: number,
    card_id: number,
    text: string,
    textType: 'title' | 'description'
  ) => Promise<boolean>;
}

interface TypeState {
  prevValueDescription: string;
  description: string;
}

class Description extends React.Component<TypeProps, TypeState> {
  mount = false;

  constructor(props: TypeProps) {
    super(props);
    const { description } = this.props;
    this.state = {
      prevValueDescription: description,
      description,
    };
  }

  componentDidMount(): void {
    this.mount = true;
  }

  componentWillUnmount(): void {
    this.mount = false;
    this.renameDescription();
    // fix Warning: Can't perform a React state update on an unmounted component
    // this.setState = (state, callback): void => {}; // TODO: ?
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handlerChangeTextarea = (event: any): void => {
    event.preventDefault();
    const { target } = event;
    const { value } = target;
    if (this.mount) this.setState({ description: value });
  };

  handlerOnBlurTextarea = (): void => {
    this.renameDescription();
  };

  renameDescription = async (): Promise<void> => {
    if (!this.mount) return;

    const { description, prevValueDescription } = this.state;

    if (description === prevValueDescription) return;

    const { listId, cardId, cardEdit } = this.props;
    const { updateBoard, boardId } = this.context as IBoardContext;
    const response = await cardEdit(boardId, listId, cardId, description, 'description');

    if (response) {
      this.setState({ prevValueDescription: description });
    } else {
      this.setState({ description: prevValueDescription });
    }

    await updateBoard();
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
  cardEdit: editCard,
};

Description.contextType = BoardContext;

export default connect(null, mapDispatchToProps)(Description);
