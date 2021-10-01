import { IBoard, IData } from '../../../common/interfaces/Interfaces';

const initialState: IData = {
  board: {
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
            users: [{ id: 1, username: 'AlBor' }],
          },
          2: {
            id: 2,
            title: 'Приготовить суп Харчо',
            description: '2descr',
            created_at: 2,
            position: 2,
            users: [{ id: 1, username: 'AlBor' }],
          },
          3: {
            id: 3,
            title: 'Сходить в магазин по хлеб',
            description: '3descr',
            created_at: 3,
            position: 3,
            users: [{ id: 1, username: 'AlBor' }],
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
            position: 4,
            users: [{ id: 1, username: 'AlBor' }],
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
            position: 5,
            users: [{ id: 1, username: 'AlBor' }],
          },
          6: {
            id: 6,
            title: 'Погулять с Беллой',
            description: '6descr',
            created_at: 6,
            position: 6,
            users: [{ id: 1, username: 'AlBor' }],
          },
        },
      },
    },
    users: [{ id: 123, username: 'para' }],
  },
};

const reducer = (state: IData = initialState, action: { type: string; payload: IBoard }): IData => {
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
