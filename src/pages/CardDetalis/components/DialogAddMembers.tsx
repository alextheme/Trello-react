/* eslint-disable prettier/prettier */
/* eslint-disable react/no-children-prop */
/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable react/prefer-stateless-function */
/* esl int-disable prettier/prettier */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import instance from '../../../api/request';
import { IFoundUsers } from '../../../common/interfaces/Interfaces';
import { IBoardContext } from '../../Board/boardContext';
import { Selection } from './partsComponent/Selection/Selection';
import HeaderPopupCardDialog from './partsComponent/HeaderPopupCardDialog/HeaderPopupCardDialog';
import { Button } from './partsComponent/Button/Button';
import { MembersContext } from './MembersCard/MembersContext';
import { assignOrRemoveUsersToOrFromCard } from '../../../store/modules/user/assignOrRemoveUsersToFromCard';

interface TypeProps {
  title: string;
  boardId: number;
  cardId: number;
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

  addMemberToCard = async (e: any): Promise<void> => {
    this.addOrRemoveMemberToCard(e, !0);
  };

  removeMemberToCard = async (e: any): Promise<void> => {
    this.addOrRemoveMemberToCard(e, !1);
  };

  // Add or remove a member depending on the checkbox on the link
  addOrRemoveMemberToCard = async (e: any, actionAddMember: boolean): Promise<void> => {
    const { target } = e;
    const { dataset } = target;
    const id = dataset.idMember;
    const { boardId, cardId } = this.props;
    const { updateBoard } = this.context as IBoardContext;

    const addMembers = actionAddMember ? [+id] : [];
    const removeMembers = actionAddMember ? [] : [+id];

    if (id) {
      assignOrRemoveUsersToOrFromCard(boardId, cardId, updateBoard, addMembers, removeMembers);
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
                      onClick={cardUsers && cardUsers.includes(user.id) ? this.removeMemberToCard : this.addMemberToCard}
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

export default DialogAddMembers;
