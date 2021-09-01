const initialState = {};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
const reducer = (state = initialState, action: { type: string; payload?: any }) => {
  switch (action.type) {
    default: {
      return { ...state, ...action.payload };
    }
  }
};

export default reducer;
