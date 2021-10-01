/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-empty-interface */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import './boardDnD.scss';
import { IBoard, IData } from '../../common/interfaces/Interfaces';
import { getBoard } from '../../store/modules/board/actions';

interface TypeProps extends RouteComponentProps {
  boardId: number;
  title: string;
  board: IBoard;
  updBoard: (boardId: string) => Promise<void>;
}

interface TypeState {}
class BoardDnD extends React.Component<TypeProps, TypeState> {
  constructor(props: TypeProps) {
    super(props);
    this.state = {};
  }

  componentDidMount(): void {
    console.log('BoardDnD mount');
    this.updateBoard();
  }

  componentWillUnmount(): void {
    console.log('BoardDnD unmount');
  }

  updateBoard = async (): Promise<void> => {
    const { updBoard, match } = this.props;
    const { params } = match; // @ts-ignore
    const { boardId } = params;
    await updBoard(boardId);
  };

  render(): JSX.Element | null {
    const { board, match } = this.props;
    const { params } = match; // @ts-ignore
    const { boardId } = params;
    const { lists, title } = board;
    console.log('props: ', this.props);

    return (
      // comment
      <div className="DnD">
        <div className="header">
          <h2>{`${boardId}, ${title}`}</h2>
        </div>
        <div id="dnd_container">
          {Object.entries(lists)
            .sort((a, b) => a[1].position - b[1].position)
            .map(([idList, list]) => (
              <div key={idList} id={`column-${idList}`} className="column">
                <div id={`list_shadow-${idList}`} className="list_shadow">
                  <div id={`list_item-${idList}`} className="list_item">
                    <div className="list_header">{list.title}</div>
                    <div className="list_content">
                      {Object.entries(list.cards)
                        .sort((a, b) => a[1].position - b[1].position)
                        .map(([idCard, card]) => {
                          console.log(idCard, card);
                          return (
                            <div key={idCard} id={`card_shadow-${idCard}`} className="card_shadow">
                              <div id={`card_item-${idCard}`} className="card_item">
                                <div id={`card-${idCard}`} className="card">
                                  {`${card.title} (${card.id})`}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }
}

// @ ts-ignore
const mapStateToProps = (state: IData): any => ({ ...state.board.board });

export default connect(mapStateToProps, { updBoard: getBoard })(withRouter(BoardDnD));
