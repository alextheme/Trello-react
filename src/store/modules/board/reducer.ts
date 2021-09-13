import { IBoard } from '../../../common/interfaces/Interfaces';

const initialState = {
  board: {
    title: 'Моя тестовая доска',
    users: [{ id: 1, username: 'dff' }],
    lists: [
      {
        id: 1,
        title: 'Планы',
        position: 1,
        cards: [
          { id: 1, title: 'помыть кота', description: '1descr', users: [1] },
          { id: 2, title: 'приготовить суп', description: '2descr', users: [1] },
          { id: 3, title: 'сходить в магазин', description: '3descr', users: [1] },
        ],
      },
      {
        id: 2,
        title: 'В процессе',
        position: 2,
        cards: [{ id: 4, title: 'посмотреть сериал', description: '4descr', users: [1] }],
      },
      {
        id: 3,
        title: 'Сделано',
        position: 3,
        cards: [
          { id: 5, title: 'сделать домашку', description: '5descr', users: [1] },
          { id: 6, title: 'погулять с собакой', description: '6descr', users: [1] },
        ],
      },
    ],
  },
};

const reducer = (state = initialState, action: { type: string; payload?: any }): IBoard => {
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
