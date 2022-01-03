import { combineReducers } from 'redux';
import boardReducer from './modules/board/reducer';
import boardsReducer from './modules/boards/reducer';
import userReducer from './modules/user/reducer';
import loadingReducer from './modules/loading/reducer';
import errorReducer from './modules/error/reducer';

export default combineReducers({
  board: boardReducer,
  boards: boardsReducer,
  user: userReducer,
  load: loadingReducer,
  error: errorReducer,
});
