import { IBoardContent, IBoardReducer } from '../../../common/interfaces/Interfaces';
import { ActionType } from './action-types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const initialState: IBoardReducer = {
  boardContent: {
    title: 'Моя тестовая доска',
    lists: {
      1: {
        id: 1,
        title: 'Планы',
        position: 1,
        cards: {
          1: {
            id: 1,
            title: 'Помыть кота Леву',
            description: '1descr',
            created_at: 1,
            position: 1,
            users: [8, 2],
          },
          2: {
            id: 2,
            title: 'Приготовить суп Харчо',
            description: '2descr',
            created_at: 2,
            position: 2,
            users: [1],
          },
          3: {
            id: 3,
            title: 'Сходить в магазин по хлеб',
            description: '3descr',
            created_at: 3,
            position: 3,
            users: [1],
          },
        },
      },
      2: {
        id: 2,
        title: 'В процессе',
        position: 2,
        cards: {
          4: {
            id: 4,
            title: 'Прочесть Библию',
            description: '4descr',
            created_at: 4,
            position: 1,
            users: [3, 5],
          },
        },
      },
      3: {
        id: 3,
        title: 'Сделано',
        position: 3,
        cards: {
          5: {
            id: 5,
            title: 'Сделать Трело 2',
            description: '5descr',
            created_at: 5,
            position: 1,
            users: [1, 2, 3],
          },
          6: {
            id: 6,
            title: 'Погулять с Беллой',
            description: '6descr',
            created_at: 6,
            position: 2,
            users: [1, 3, 6],
          },
        },
      },
    },
    users: [2],
  },
};

const reducer = (state: IBoardReducer, action: { type: string; payload: IBoardContent }): IBoardReducer => {
  switch (action.type) {
    case ActionType.UPDATE_BOARD:
      return {
        ...state,
        boardContent: action.payload,
      };
    case ActionType.CLEAR_BOARD:
      return {
        ...state,
        boardContent: null,
      };
    default: {
      return { ...state };
    }
  }
};

export default reducer;
