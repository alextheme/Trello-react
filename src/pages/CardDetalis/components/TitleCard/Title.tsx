import React from 'react';
import { connect } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import { editCard } from '../../../../store/modules/board/action-creators';
import { BoardContext } from '../../../Board/boardContext';
import './Title.scss';

interface TypeProps {
  boardId: number;
  listId: number;
  cardId: number;
  title: string;
  cardEdit: (
    board_id: number,
    list_id: number,
    card_id: number,
    text: string,
    textType: 'title' | 'description'
  ) => Promise<boolean>;
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
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (): void => {};

    this.renameTitle();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    const { prevValueTitle, title } = this.state;
    if (prevValueTitle === title) return;

    const { boardId, listId, cardId, cardEdit } = this.props;

    const response = await cardEdit(boardId, listId, cardId, title, 'title');

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

const mapDispatchToProps = { cardEdit: editCard };

Title.contextType = BoardContext;

export default connect(null, mapDispatchToProps)(Title);
