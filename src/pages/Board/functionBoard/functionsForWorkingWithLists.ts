import { IListContent } from '../../../common/interfaces/Interfaces';

interface INewListPositon {
  id: number;
  position: number;
}

interface IForState {
  lists: { [id: number]: IListContent };
}

interface IFunctionReturn {
  newListsPosition: INewListPositon[];
  dataForState: IForState;
}

interface IPropsFunctionList {
  movingListId: number;
  indexNewPositionActiveElement: number;
  dataLists: { [id: number]: IListContent };
}

/**
 * Moving the list
 */
export const movingList = ({ ...props }: IPropsFunctionList): IFunctionReturn => {
  const { movingListId, indexNewPositionActiveElement, dataLists } = props;
  const newListsPosition: INewListPositon[] = [];

  const lists = { ...dataLists };
  const sort = Object.entries(lists).sort((a, b) => a[1].position - b[1].position);
  const delList = sort.splice(lists[movingListId].position - 1, 1);
  sort.splice(indexNewPositionActiveElement, 0, delList[0]);
  sort.forEach(([, list], index) => {
    if (list.position !== index + 1) {
      // eslint-disable-next-line no-param-reassign
      list.position = index + 1;
      newListsPosition.push({ id: list.id, position: list.position });
    }
  });

  return {
    newListsPosition,
    dataForState: { lists },
  };
};
