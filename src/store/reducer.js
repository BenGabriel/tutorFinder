const userReducer = (state, { type, payload }) => {
  switch (type) {
    case "SAVE_USER":
      return {
        ...state,
        user: payload,
      };
    case "GET_COURSES":
      return {
        ...state,
        courses: payload,
      };
    case "GET_SESSIONS":
      return {
        ...state,
        sessions: payload,
      };
    default:
      return state;
  }
};

export default userReducer
