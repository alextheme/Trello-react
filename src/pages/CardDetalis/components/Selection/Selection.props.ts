/* eslint-disable @typescript-eslint/no-explicit-any */
import { HTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';
import { IBoards, IBoardContent } from '../../../../common/interfaces/Interfaces';
import { ICurrentValue } from '../CopyCard/CopyCard.props';

interface ISelectBoardData extends ICurrentValue {
  key: 'boards';
  valueId: number; // boardId
  value: IBoards;
}

interface ISelectListsData extends ICurrentValue {
  key: 'lists';
  valueId: number; // listId
  value: IBoardContent;
}

interface ISelectCardsData extends ICurrentValue {
  key: 'cards';
  boardId: number;
  listId: number;
  positionCard: number;
  numberCards: number;
}

type TypeSelectData = ISelectBoardData | ISelectListsData | ISelectCardsData;

export interface SelectionProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children?: ReactNode;
  data: TypeSelectData;
}
