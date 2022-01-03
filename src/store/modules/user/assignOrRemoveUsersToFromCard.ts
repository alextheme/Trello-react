import instance from '../../../api/request';

export const assignOrRemoveUsersToOrFromCard = async (
  boardId: number,
  cardId: number,
  updateBoard: () => void,
  add: number[],
  remove: number[]
): Promise<void> => {
  const result = (await instance.put(`/board/${boardId}/card/${cardId}/users`, {
    add,
    remove,
  })) as { result: string };

  if (result.result === 'Updated') {
    updateBoard();
  }
};
