/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { IBoardContent } from '../../common/interfaces/Interfaces';

export interface IBoardContext {
  updateBoard: () => Promise<void>;
  handlerOpenDetatisCard: (evetn: any) => void;
  boardId: number;
  boardUsers: number[];
  boardData: IBoardContent;
}

export const BoardContext = React.createContext<Partial<IBoardContext>>({});
