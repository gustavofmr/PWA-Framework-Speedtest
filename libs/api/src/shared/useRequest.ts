import * as React from 'react';

enum RequestAction {
  Load = 'load',
  Success = 'success',
  Error = 'error',
}

export interface State<T> {
  data: T | null;
  loading: boolean;
  error: false | unknown;
}

type Action<T> =
  | { type: RequestAction.Load }
  | { type: RequestAction.Success; payload: T }
  | { type: RequestAction.Error; error: unknown };

export function useRequest<T>() {
  function reducer(state: State<T>, action: Action<T>): State<T> {
    let never: never;

    switch (action.type) {
      case RequestAction.Load:
        return { ...state, error: false, loading: true };
      case RequestAction.Success:
        return { data: action.payload, error: false, loading: false };
      case RequestAction.Error:
        return { ...state, error: action.error, loading: false };
      default:
        // To quickly catch when you miss some actions
        never = action;
        throw new TypeError(`Action ${never} not covered in reducer.`);
    }
  }

  const [state, dispatch] = React.useReducer(reducer, {
    data: null,
    loading: false,
    error: false,
  });

  function load() {
    dispatch({ type: RequestAction.Load });
  }

  function reqSuccess(payload: T) {
    dispatch({ type: RequestAction.Success, payload });
  }

  function reqError(error: unknown) {
    dispatch({ type: RequestAction.Error, error });
  }

  return {
    error: state.error,
    data: state.data,
    loading: state.loading,
    state,
    load,
    reqSuccess,
    reqError,
  };
}
