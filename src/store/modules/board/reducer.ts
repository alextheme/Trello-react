/* eslint-disable @typescript-eslint/no-explicit-any */
import { IBackendDataBoard } from '../../../common/interfaces/Interfaces';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const initialState: any = {
  board: {
    title: 'Моя тестовая доска',
    lists: [
      {
        id: 1,
        title: 'Планы',
        position: 1,
        cards: [
          {
            id: 1,
            title: 'Помыть кота Леву',
            description: '1descr',
            created_at: 1,
            position: 1,
            users: [{ id: 1, username: 'AlBor' }],
          },
          {
            id: 2,
            title: 'Приготовить суп Харчо',
            description: '2descr',
            created_at: 2,
            position: 2,
            users: [{ id: 1, username: 'AlBor' }],
          },
          {
            id: 3,
            title: 'Сходить в магазин по хлеб',
            description: '3descr',
            created_at: 3,
            position: 3,
            users: [{ id: 1, username: 'AlBor' }],
          },
        ],
      },
      {
        id: 2,
        title: 'В процессе',
        position: 2,
        cards: [
          {
            id: 4,
            title: 'Прочесть Библию',
            description: '4descr',
            created_at: 4,
            position: 4,
            users: [{ id: 1, username: 'AlBor' }],
          },
        ],
      },
      {
        id: 3,
        title: 'Сделано',
        position: 3,
        cards: [
          {
            id: 5,
            title: 'Сделать Трело 2',
            description: '5descr',
            created_at: 5,
            position: 5,
            users: [{ id: 1, username: 'AlBor' }],
          },
          {
            id: 6,
            title: 'Погулять с Беллой',
            description: '6descr',
            created_at: 6,
            position: 6,
            users: [{ id: 1, username: 'AlBor' }],
          },
        ],
      },
    ],
    users: [{ id: 123, username: 'para' }],
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const reducer = (
  state: any = initialState,
  action: { type: string; payload: IBackendDataBoard }
): IBackendDataBoard => {
  switch (action.type) {
    case 'UPDATE_BOARD':
      return {
        ...state,
        board: action.payload,
      };
    default: {
      return { ...state, ...action.payload };
    }
  }
};

export default reducer;
