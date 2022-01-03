import { HTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';
import { IBoards, IBoardContent, IListContent } from '../../../../../common/interfaces/Interfaces';
import { ICurrentValue } from '../../MoveCard/MoveCard.props';

interface ICommonInterface extends ICurrentValue {
  valueId: number; // cardId || listId || boardId
}

interface ISelectBoardData extends ICommonInterface {
  key: 'boards';
  value: IBoards;
}

interface ISelectListsData extends ICommonInterface {
  key: 'lists';
  value: IBoardContent;
}

interface ISelectCardsData extends ICommonInterface {
  key: 'cards';
  value: IListContent;
}

type TypeSelectData = ISelectBoardData | ISelectListsData | ISelectCardsData;

export interface SelectionProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children?: ReactNode;
  data: TypeSelectData;
}
