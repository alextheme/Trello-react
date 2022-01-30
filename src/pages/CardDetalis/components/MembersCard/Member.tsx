/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { connect } from 'react-redux';
import { getFromSessionStorageToken } from '../../../../store/modules/user/session-storage-actions';
import { BoardContext, IBoardContext } from '../../../Board/boardContext';
import DialogAddMembers from '../DialogAddMembers';
import { assignOrRemoveUsersToOrFromCard } from '../../../../store/modules/user/assignOrRemoveUsersToFromCard';

interface TypeProps {
  name?: string;
  email?: string;
  userLoggedId?: number;
  boardId: number;
  cardId: number;
  id: number;
  typeButton: 'member' | 'add' | 'join';
  confirmationId: number;
  hide: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  show: (e: any) => void;
  userAssignOrRemove: (
    boardId: number,
    cardId: number,
    updateBoard: () => void,
    add: number[],
    remove: number[]
  ) => Promise<boolean>;
}

class Member extends React.Component<TypeProps> {
  constructor(props: TypeProps) {
    super(props);
    this.state = {};
  }

  componentDidMount(): void {
    // const { isShow } = this.props;
  }

  // Join User Logged
  handlerJoinMemberOnClick = async (): Promise<void> => {
    const { updateBoard } = this.context as IBoardContext;
    const { boardId, cardId, userAssignOrRemove } = this.props;
    const userToken = getFromSessionStorageToken();

    if (boardId && cardId && userToken && updateBoard) {
      if (+userToken) {
        console.log('adfasdf');
        userAssignOrRemove(boardId, cardId, updateBoard, [+userToken], []);
      }
    }
  };

  // Remove User
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeUserFromCard = async (e: any): Promise<void> => {
    const { boardId, cardId, userAssignOrRemove } = this.props;
    const { target } = e;
    const { dataset } = target;
    const idUser = dataset.userId;
    const { updateBoard } = this.context;

    if (boardId && cardId && idUser && updateBoard) {
      userAssignOrRemove(boardId, cardId, updateBoard, [], [+idUser]);
    }
  };

  render(): JSX.Element {
    const { name, email, typeButton, boardId, cardId, id, confirmationId, show, hide } = this.props;
    const isShow = confirmationId === id;

    if (typeButton === 'add') {
      return (
        <div className="member add">
          <span className="member-button" data-member-id={id} onClick={show} title="Добавить участника">
            +
          </span>
          {isShow && <DialogAddMembers title="Hello To Add Members" boardId={boardId} cardId={cardId} />}
        </div>
      );
    }

    if (typeButton === 'join') {
      return (
        <div className="member join">
          <span
            className="member-button"
            data-member-id={id}
            onClick={this.handlerJoinMemberOnClick}
            title="Присоединиться"
          >
            join
          </span>
        </div>
      );
    }

    return (
      <div className="member">
        <span className="member-button" data-member-id={id} onClick={show} title={name || (id && `${id}`) || ''}>
          {name || id}
        </span>

        <div className={`detalis_member ${isShow ? 'isShow' : ''}`}>
          <button className="close-button" onClick={hide}>
            {/* <CloseIcon /> */}x
          </button>

          <div className="info_member">
            <div className="info">
              <div className="img_info" />
              <div className="contact_info">
                <span className="i_name">{name || id}</span>
                {email && <span className="i_email">{email}</span>}
              </div>
            </div>

            <ul>
              <li className="action_with_member_card" data-user-id={id} onClick={this.removeUserFromCard}>
                Remove from card
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

Member.contextType = BoardContext;

export default connect(null, { userAssignOrRemove: assignOrRemoveUsersToOrFromCard })(Member);
