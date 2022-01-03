/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

export interface IMembersContext {
  usersCard: number[];
  updateBoard: () => Promise<void>;
}

export const MembersContext = React.createContext<Partial<IMembersContext>>({});
