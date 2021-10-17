const reducer = (state = { loading: false }, action: { type: string }): { loading: boolean } => {
  switch (action.type) {
    case 'LOAD_START':
      return {
        ...state,
        loading: true,
      };
    case 'LOAD_END':
      return {
        ...state,
        loading: false,
      };
    default: {
      return { ...state };
    }
  }
};

export default reducer;
