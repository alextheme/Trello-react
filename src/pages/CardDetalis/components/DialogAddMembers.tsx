/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { connect } from 'react-redux';
import instance from '../../../api/request';
import { IFoundUsers } from '../../../common/interfaces/Interfaces';
import { IBoardContext } from '../../Board/boardContext';
import HeaderPopupCardDialog from './HeaderPopupCardDialog/HeaderPopupCardDialog';
import { MembersContext } from './MembersCard/MembersContext';
import { assignOrRemoveUsersToOrFromCard } from '../../../store/modules/user/assignOrRemoveUsersToFromCard';

interface TypeProps {
  title: string;
  boardId: number;
  cardId: number;
  userAssignOrRemove: (
    boardId: number,
    cardId: number,
    updateBoard: () => void,
    add: number[],
    remove: number[]
  ) => Promise<boolean>;
}

interface TypeState {
  inputValue: string;
  usersCard: IFoundUsers[];
}

class DialogAddMembers extends React.Component<TypeProps, TypeState> {
  constructor(props: TypeProps) {
    super(props);
    this.state = {
      inputValue: '',
      usersCard: [],
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handlerInputOnChange = async (e: any): Promise<void> => {
    const { value } = e.target;
    this.setState({ inputValue: value });

    if (value) {
      const resultSearchUsers = (await instance.get('/user', { params: { emailOrUsername: value } })) as IFoundUsers[];

      this.setState({ usersCard: resultSearchUsers });
    } else {
      this.setState({ usersCard: [] });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addMemberToCard = async (e: any): Promise<void> => {
    this.addOrRemoveMemberToCard(e, !0);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeMemberToCard = async (e: any): Promise<void> => {
    this.addOrRemoveMemberToCard(e, !1);
  };

  // Add or remove a member depending on the checkbox on the link
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addOrRemoveMemberToCard = async (e: any, actionAddMember: boolean): Promise<void> => {
    const { target } = e;
    const { dataset } = target;
    const id = dataset.idMember;
    const { boardId, cardId, userAssignOrRemove } = this.props;
    const { updateBoard } = this.context as IBoardContext;

    const addMembers = actionAddMember ? [+id] : [];
    const removeMembers = actionAddMember ? [] : [+id];

    if (id) {
      userAssignOrRemove(boardId, cardId, updateBoard, addMembers, removeMembers);
    }
  };

  render(): JSX.Element {
    const { title } = this.props;
    const { inputValue, usersCard } = this.state;
    const { usersCard: cardUsers } = this.context;

    return (
      <div className="dialog-add-members">
        <HeaderPopupCardDialog title={title} classname="add-members-dialog" />
        <div className="dg-pop-over-content">
          <input
            className="dg-pop-over-input-search-members"
            type="text"
            placeholder="Найти участника по имени или эл.адресу"
            value={inputValue}
            onChange={this.handlerInputOnChange}
          />
          <div className="dg-pop-over-section dg-board-members">
            <h4 className="title">Участники</h4>
            <div className="loading">
              <ul className="member-list">
                {usersCard.map((user) => (
                  <li key={user.id} className="member-item">
                    <a
                      href="#"
                      title={user.username}
                      onClick={
                        cardUsers && cardUsers.includes(user.id) ? this.removeMemberToCard : this.addMemberToCard
                      }
                    >
                      <span className="hiden-data" data-id-member={user.id} />
                      <span className="name">{user.username} </span>
                      <span className="id">({user.id})</span>
                      {cardUsers && cardUsers.includes(user.id) && (
                        <span className="checked-icon" aria-label="Этот участник добавлен к карточке">
                          <FontAwesomeIcon icon={['fas', 'check']} />
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DialogAddMembers.contextType = MembersContext;

export default connect(null, { userAssignOrRemove: assignOrRemoveUsersToOrFromCard })(DialogAddMembers);
