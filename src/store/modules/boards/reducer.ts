import { IData as IBoard } from '../../../common/interfaces/Interfaces'; // не забудьте описать этот интерфейс :)

const initialState = {
  boards: [] as IBoard[],
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
const reducer = (state = initialState, action: { type: string; payload?: any }) => {
  switch (action.type) {
    case 'UPDATE_BOARDS':
      return {
        ...state,
        boards: action.payload,
      };
    default: {
      return { ...state, ...action.payload };
    }
  }
};

export default reducer;
