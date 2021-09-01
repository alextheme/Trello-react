import { Dispatch } from 'redux';
import instance from '../../../api/request';

export const getBoards =
  () =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      const data = await instance.get('/board');
      await dispatch({ type: 'UPDATE_BOARDS', payload: data });
    } catch (e) {
      console.log(e);
      dispatch({ type: 'ERROR_ACTION_TYPE' });
    }
  };
