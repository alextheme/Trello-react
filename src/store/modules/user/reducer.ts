const initialState = {
  user: [
    { id: 1, username: 'dff' },
    { id: 2, username: 'user2' },
  ],
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any
const reducer = (state = initialState, action: { type: string; payload?: any }) => {
  switch (action.type) {
    default: {
      return { ...state, ...action.payload };
    }
  }
};

export default reducer;
