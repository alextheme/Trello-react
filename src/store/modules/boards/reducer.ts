import { IBackendDataBoards, ActionType } from '../../../common/interfaces/Interfaces';

const initialState: IBackendDataBoards = {
  boards: [
    { id: 1, title: 'покупки' },
    { id: 2, title: 'подготовка к свадьбе' },
    { id: 3, title: 'разработка интернет-магазина' },
    { id: 4, title: 'курс по продвижению в соцсетях' },
    { id: 5, title: 'курс фронтэнда' },
  ],
};

const reducer = (state = initialState, action: ActionType): IBackendDataBoards => {
  switch (action.type) {
    case 'UPDATE_BOARDS':
      return {
        ...state,
        boards: action.payload,
      };
    case 'UPDATE_BOARDS_LOCAL':
      return {
        ...state,
      };
    default: {
      return { ...state, ...action.payload };
    }
  }
};

export default reducer;
