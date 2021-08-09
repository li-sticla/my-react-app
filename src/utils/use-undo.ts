import { useCallback, useReducer } from "react";

const UNDO = "UNDO";
const REDO = "REDO";
const SET = "SET";
const RESET = "RESET";

type State<T> = {
  past: T[];
  present: T;
  future: T[];
};

type Action<T> = {
  newPresent?: T;
  type: typeof UNDO | typeof REDO | typeof SET | typeof RESET;
};

const undoReducer = <T>(state: State<T>, action: Action<T>) => {
  const { past, present, future } = state;
  const { newPresent } = action;

  switch (action.type) {
    case UNDO: {
      if (past.length === 0) return state;

      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      };
    }

    case REDO: {
      if (future.length === 0) return state;

      const next = future[0];
      const newFuture = future.slice(1);

      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      };
    }

    case SET: {
      if (newPresent === present) {
        return state;
      }
      return {
        past: [...past, present],
        present: newPresent,
        future: [],
      };
    }

    case RESET: {
      return {
        past: [],
        present: newPresent,
        future: [],
      };
    }
  }
};

export const useUndo = <T>(initialPresent: T) => {
  const [state, dispatch] = useReducer(undoReducer, {
    past: [],
    present: initialPresent,
    future: [],
  } as State<T>);

  const canUndo = state.past.length !== 0;
  const canRedo = state.future.length !== 0;

  const undo = useCallback(() => dispatch({ type: UNDO }), []);

  const redo = useCallback(() => dispatch({ type: REDO }), []);

  const set = useCallback(
    (newPresent: T) => dispatch({ type: SET, newPresent }),
    []
  );

  const reset = useCallback(
    (newPresent: T) => dispatch({ type: RESET, newPresent }),
    []
  );

  return [state, { set, reset, undo, redo, canUndo, canRedo }] as const;
};

/**
 *reset(1) [1]
 * past:[]
 * present:1
 * future:[]
 *
 *set(2) [1] => [1,2]
 * past:[1]
 * newPresent:2 => present:2
 * future:[]
 *
 *set(3) [1,2] => [1,2,3]
 * past:[1,2]
 * newPresent:3 => present:3
 * future:[]
 *
 *undo [1,2,3] => [1,2]
 * newPast: [1] => past: [1]
 * previous:2 => present:2
 * future:[3]
 *
 *undo [1,2] => [1]
 * newPast:[] => past[]
 * previous:1 present:1
 * future:[2,3]
 *
 *redo [1] => [1,2]
 * past:[1]
 * next:2 => present:2
 * future:[3]
 *
 *redo [1,2] => [1,2,3]
 * past: [1,2]
 * next:3 => present:3
 * future: []
 */
