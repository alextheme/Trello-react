import { IUserReducer } from '../../../common/interfaces/Interfaces';
import { ActionType } from './action-types';
import { Action } from './actions';
import { getToken } from './session-storage-actions';

const getInitialState = (): IUserReducer => ({ userIsLogged: !!getToken() });

const reducer = (state: IUserReducer = getInitialState(), action: Action): IUserReducer => {
  switch (action.type) {
    case ActionType.AUTORIZATION:
      return { ...state, userIsLogged: true };
    case ActionType.LOGOUT:
      return { ...state, userIsLogged: false };

    default: {
      return state;
    }
  }
};

export default reducer;
