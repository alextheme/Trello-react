import React from 'react';
import { connect } from 'react-redux';
import { logOut } from '../../../../store/modules/user/action-creators';
import { IUserReducer } from '../../../interfaces/Interfaces';
import './logout.scss';

interface TypeProps extends IUserReducer {
  userOutLog: () => void;
}

class LogOut extends React.Component<TypeProps> {
  constructor(props: TypeProps) {
    super(props);
    this.handleLogOut = this.handleLogOut.bind(this);
  }

  handleLogOut(): void {
    const { userOutLog } = this.props;
    userOutLog();
  }

  render(): React.ReactNode | null {
    const { userIsLogged } = this.props;

    if (userIsLogged) {
      return (
        <div className="logout-box">
          <button className="logout-button" onClick={this.handleLogOut}>
            Log out
          </button>
        </div>
      );
    }
    return null;
  }
}

interface IMapStateToProps {
  user: IUserReducer;
}

export default connect((state: IMapStateToProps) => ({ ...state.user }), { userOutLog: logOut })(LogOut);
