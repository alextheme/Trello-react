/* eslint-disable no-console */
import { IBoardsListReducer } from '../../../common/interfaces/Interfaces';
import { ActionType } from './action-types';
import { Action } from './actions';

const initialState = {
  boardsList: [
    // { id: 1, title: 'покупки' },
    // { id: 2, title: 'подготовка к свадьбе' },
    // { id: 3, title: 'разработка интернет-магазина' },
    // { id: 4, title: 'курс по продвижению в соцсетях' },
    // { id: 5, title: 'курс фронтэнда' },
  ],
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
