/**
 * Definition for store
 * @typedef {Object} store
 * @property {*} dispatch - Updates store state
 * @property {*} getState - Gets store state
 * @property {*} subscribe
 */

/**
 * Definition for action
 * @typedef {Object} action
 * @property {string} type - action type
 */

/**
 * Alternative state definition for a function
 * @param {Object[]} state - Store state
 * @param {string} state[].id - todo ID
 */

/**
 * Alternative action definition for a function
 * @param {Object} action - Action chnaging the state
 * @param {string}  action.type - Type of the action
 */

/**
 * Definition for TODO
 * @typedef {Object} todo
 * @property {string} id - todo ID
 */

/**
 * The store should have 4 parts
 * 1. The state
 * 2. Get the state
 * 3. Listen for state changes
 * 4. Update the state
 * @param {*} reducer - Reducer function
 * @returns {store}
 */
const createStore = (reducer) => {
  // The State
  let state;
  /**
   * Gets current state value: RETURNS THE STATE
   * @returns {todo[]} state - Store state
   */
  const getState = () => state;

  // listeners: Array of all the functions to call whenever state changes
  let listeners = [];

  /**
   *
   * @callback unsubscribe
   */
  /**
   * Updates listeners: LISTENS FOR CHANGES
   * @param {*} listener
   * @returns {unsubscribe} unsubscribe
   */
  const subscribe = (listener) => {
    listeners.push(listener);

    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  };

  /**
   * Update the store
   * @param {action} action - Action chnaging the state
   */
  const dispatch = (action) => {
    state = reducer(state, action);

    listeners.forEach((l) => l());
  };

  return { dispatch, getState, subscribe };
};

/**
 * TODO reducer
 * @param {todo[]} [state=[]] - Store state
 * @param {action} action - Action chnaging the state
 * @returns {todo[]} - Updated state
 */
const todos = (state = [], action) =>
  ({
    ADD_TODO: [...state, action.todo],
    REMOVE_TODO: state.filter(({ id }) => id !== action.id),
    TOGGLE_TODO: state.map((todo) =>
      todo.id === action.id ? { ...todo, complete: !todo.complete } : todo
    ),
  }[action.type] || state);

const store = createStore(todos);

store.subscribe(() => console.log("The new state is ", store.getState()));

store.dispatch({
  type: "ADD_TODO",
  todo: { id: 0, name: "Learn Redux", complete: false },
});
