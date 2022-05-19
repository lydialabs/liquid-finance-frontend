/* eslint-disable */
import React, { createContext, Reducer, useContext, useReducer } from "react";
import produce from "immer";
import { IProduce } from "immer/dist/internal";

interface Store<T> {
  Provider: React.FC;
  useStore: () => [T, any];
}

export const createStore = <T,>(initialState: T): Store<T> => {
  const StateContext = createContext(initialState);
  const UpdateContext = createContext<any>(null);

  const useStore: () => [T, any] = () => [
    useContext(StateContext),
    useContext(UpdateContext),
  ];

  const StoreProvider: React.FC = ({ children }) => {
    const [state, updateState] = useReducer<Reducer<T, IProduce>>(
      produce,
      initialState
    );
    return (
      <UpdateContext.Provider value={updateState}>
        <StateContext.Provider value={state}>{children}</StateContext.Provider>
      </UpdateContext.Provider>
    );
  };

  return { Provider: StoreProvider, useStore };
};
