/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

export interface IBoardContext {
  updateBoard: () => Promise<void>;
  handlerOpenDetatisCard: (evetn: any) => void;
  boardId: number;
  boardUsers: number[];
}

export const BoardContext = React.createContext<Partial<IBoardContext>>({});
