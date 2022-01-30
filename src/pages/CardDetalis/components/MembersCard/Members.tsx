/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { ICardContent } from '../../../../common/interfaces/Interfaces';
import { getFromSessionStorageToken } from '../../../../store/modules/user/session-storage-actions';
import { BoardContext, IBoardContext } from '../../../Board/boardContext';
import Member from './Member';
import { MembersContext } from './MembersContext';
import './Members.scss';

interface TypeProps {
  boardUsers: number[];
  boardId: string;
  card: ICardContent;
}

interface TypeState {
  isShowInfoMemberId: number;
  token: string | null;
}

// number, non-existent ID
// To confirm opening a dialog box with users
const nonExistentID = -1111111111111111;

class Members extends React.Component<TypeProps, TypeState> {
  constructor(props: TypeProps) {
    super(props);
    this.state = {
      isShowInfoMemberId: nonExistentID,
      token: getFromSessionStorageToken(),
    };
  }

  componentDidMount(): void {
    window.addEventListener('click', this.handlerOnClickWindow);
  }

  componentWillUnmount(): void {
    window.removeEventListener('click', this.handlerOnClickWindow);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handlerOnClickWindow = (e: any): void => {
    // Кнопка учасника
    const memberNameButton = e.target?.closest('.member-button');
    // Кнопка закрытия контейнера деталей участника
    const closeButton = e.target?.closest('.detalis_member .close-button');
    // Контейнер детали учасника
    const cardDialog = e.target?.closest('.detalis_member');
    // Контейнер диалог добавления участников
    const dialogAddMembers = e.target?.closest('.dialog-add-members');
    // Кнопка закрытия диалога добавления участников
    const closeBtnAddMembersDialog = e.target?.closest('.add-members-dialog .close-btn');

    if ((!memberNameButton && !cardDialog && !dialogAddMembers) || closeButton || closeBtnAddMembersDialog) {
      this.infoMemberHide();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  infoMemberShow = (e: any): void => {
    const id = e.target.dataset.memberId;
    this.setState({ isShowInfoMemberId: +id });
  };

  infoMemberHide = (): void => {
    this.setState({ isShowInfoMemberId: nonExistentID });
  };

  render(): JSX.Element {
    const { boardId, card } = this.props;
    const { isShowInfoMemberId, token } = this.state;
    const { updateBoard } = this.context as IBoardContext;
    const isJoined = token && +token ? card.users.includes(+token) : !1;
    const usersCard = card.users.length ? card.users : [];

    return (
      <MembersContext.Provider value={{ usersCard, updateBoard }}>
        <div className="members-container">
          {card.users.map((u) => (
            <Member
              key={u}
              typeButton="member"
              boardId={+boardId}
              cardId={card.id}
              id={u}
              confirmationId={isShowInfoMemberId}
              hide={this.infoMemberHide}
              show={this.infoMemberShow}
            />
          ))}
          <Member
            typeButton="add"
            boardId={+boardId}
            cardId={card.id}
            id={-1}
            confirmationId={isShowInfoMemberId}
            hide={this.infoMemberHide}
            show={this.infoMemberShow}
          />
          {!isJoined && (
            <Member
              typeButton="join"
              boardId={+boardId}
              cardId={card.id}
              id={-2}
              confirmationId={isShowInfoMemberId}
              hide={this.infoMemberHide}
              show={this.infoMemberShow}
            />
          )}
        </div>
      </MembersContext.Provider>
    );
  }
}

Members.contextType = BoardContext;

export default Members;
