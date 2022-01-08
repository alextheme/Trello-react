import { IUserReducer } from '../../../common/interfaces/Interfaces';
import { ActionType } from './action-types';
import { Action } from './actions';
import { getToken } from './session-storage-actions';

const getInitialState = (): IUserReducer => ({ userIsLogged: !!getToken(), userEmail: '', userName: '', userId: -1 });

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any
const reducer = (state: IUserReducer = getInitialState(), action: Action) => {
  switch (action.type) {
    case ActionType.AUTORIZATION:
      return { ...state, userIsLogged: true, userEmail: action.payload };
    // case ActionType.AUTHORIZED_USER_FILL_THE_DATA:
    //   return { ...state, userIsLogged: true, userName: action.payload.userName, userId: action.payload.userId };
    case ActionType.LOGOUT:
      return { ...state, userIsLogged: false, userEmail: '', userName: '', userId: -1 };

    default: {
      return state;
    }
  }
};

export default reducer;
