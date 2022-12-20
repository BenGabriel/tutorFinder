import { createContext, useReducer } from "react";
import userReducer from "./reducer";
import userInitialState from "./action";

export const UserContext = createContext();

const UserState = (props) => {
  const [state, userDispatch] = useReducer(userReducer, userInitialState);

  return (
    <UserContext.Provider
      value={{
        state,
        userDispatch,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;
