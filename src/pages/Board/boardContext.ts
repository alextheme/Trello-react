import React from 'react';
import { IBoardContent } from '../../common/interfaces/Interfaces';

export interface IBoardContext {
  updateBoard: () => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handlerOpenDetatisCard: (evetn: any) => void;
  boardId: number;
  boardUsers: number[];
  boardData: IBoardContent;
}

export const BoardContext = React.createContext<Partial<IBoardContext>>({});
