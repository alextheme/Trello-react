import { IBoardsListReducer } from '../../../common/interfaces/Interfaces';
import { ActionType } from './action-types';
import { Action } from './actions';

const initialState = {
  boardsList: [],
};

const reducer = (state: IBoardsListReducer = initialState, action: Action): IBoardsListReducer => {
  switch (action.type) {
    case ActionType.UPDATE_BOARDS:
      return { boardsList: action.payload };
    case ActionType.CLEAR_BOARDS:
      return { boardsList: null };

    default: {
      return state;
    }
  }
};

export default reducer;
