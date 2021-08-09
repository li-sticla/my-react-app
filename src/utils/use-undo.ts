import { useCallback, useState } from "react";

export const useUndo = <T>(initialPresent: T) => {
  const [state, setState] = useState<{ past: T[]; present: T; future: T[] }>({
    past: [],
    present: initialPresent,
    future: [],
  });

  const canUndo = state.past.length !== 0;
  const canRedo = state.future.length !== 0;

  const undo = useCallback(() => {
    setState((currentState) => {
      const { past, present, future } = currentState;

      if (past.length === 0) return currentState;

      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((currentState) => {
      const { past, present, future } = currentState;
      if (future.length === 0) return currentState;

      const next = future[0];
      const newFuture = future.slice(1);
      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const set = useCallback((newPresent: T) => {
    setState((currentState) => {
      const { past, present } = currentState;
      if (newPresent === present) {
        return currentState;
      }
      return {
        past: [...past, present],
        present: newPresent,
        future: [],
      };
    });
  }, []);

  const reset = useCallback((newPresent: T) => {
    setState(() => {
      return {
        past: [],
        present: newPresent,
        future: [],
      };
    });
  }, []);

  return [state, { set, reset, undo, redo, canUndo, canRedo }];
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
