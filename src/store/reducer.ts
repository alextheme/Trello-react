import { combineReducers } from 'redux';
import boardReducer from './modules/board/reducer';
import boardsReducer from './modules/boards/reducer';
import userReducer from './modules/user/reducer';
import loading from './modules/loading/reducer';

export default combineReducers({
  load: loading,
  board: boardReducer,
  boards: boardsReducer,
  user: userReducer,
});
