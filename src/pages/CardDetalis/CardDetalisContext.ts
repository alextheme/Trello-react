/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from 'react';

export interface ICardDetalisContext {
  updateBoard: () => Promise<void>;
}

export const CardDetalisContext = createContext<Partial<ICardDetalisContext>>({});
